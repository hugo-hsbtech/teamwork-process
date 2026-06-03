#!/usr/bin/env bash
# Assemble the hugo-hsbtech/teamwork-process-marketplace repo contents from this
# (teamwork-process) checkout. Run from the teamwork-process repo root.
#
#   migration/build-marketplace.sh <target-dir>
#
# Produces, in <target-dir>:
#   .claude-plugin/marketplace.json     (the marketplace manifest)
#   plugins/hsb-teamwork/...            (the self-contained plugin)
#   evals/...                           (self-contained eval harness, no runs/)
#   .claude/skills, .claude/agents      (dev symlinks into the plugin)
#   README.md                           (marketplace root readme)
#
# It does NOT push. After running, cd into <target-dir>, git init/commit, set the
# remote to git@github.com:hugo-hsbtech/teamwork-process-marketplace.git, and push.
set -euo pipefail
SRC="$(cd "$(dirname "$0")/.." && pwd)"
TGT="${1:?usage: migration/build-marketplace.sh <target-dir>}"
mkdir -p "$TGT/.claude-plugin" "$TGT/plugins" "$TGT/evals"

cp "$SRC/.claude-plugin/marketplace.json" "$TGT/.claude-plugin/marketplace.json"
cp -R "$SRC/plugins/hsb-teamwork" "$TGT/plugins/hsb-teamwork"

# evals minus the gitignored runs/ outputs
if command -v rsync >/dev/null 2>&1; then
  rsync -a --exclude 'runs/' "$SRC/evals/" "$TGT/evals/"
else
  cp -R "$SRC/evals/." "$TGT/evals/"; rm -rf "$TGT/evals/intake-brainstorm/runs"
fi

# Dev symlinks so the plugin auto-loads when working inside the marketplace repo
mkdir -p "$TGT/.claude/skills" "$TGT/.claude/agents"
ln -sfn ../../plugins/hsb-teamwork/skills/intake-brainstorm "$TGT/.claude/skills/intake-brainstorm"
for f in "$TGT/plugins/hsb-teamwork/agents/"intake-*.md; do
  n="$(basename "$f")"; ln -sfn "../../plugins/hsb-teamwork/agents/$n" "$TGT/.claude/agents/$n"
done

cat > "$TGT/README.md" <<'MD'
# teamwork-process-marketplace

Claude Code plugin marketplace **`hsb-tech`**, hosting the **`hsb-teamwork`** plugin
(a demand-to-delivery toolkit) plus a Codex adapter.

- Install (Claude): `/plugin marketplace add hugo-hsbtech/teamwork-process-marketplace`
  then `/plugin install hsb-teamwork@hsb-tech` and invoke `/hsb-teamwork:intake-brainstorm`.
- Codex and full setup: see `plugins/hsb-teamwork/GET-STARTED.md`.
- Dev evals (not shipped to users): `evals/` — `cd evals/intake-brainstorm && ./run.sh`.

Layout:

```
.claude-plugin/marketplace.json   # the hsb-tech marketplace
plugins/hsb-teamwork/             # the plugin (skill + 15 agents + codex adapter)
evals/                            # repo-level eval harness (self-contained)
```
MD

echo "Assembled marketplace tree at: $TGT"
echo "Next:"
echo "  cd \"$TGT\" && git init -b main && git add -A && git commit -m 'Initial: hsb-tech marketplace + hsb-teamwork plugin'"
echo "  git remote add origin git@github.com:hugo-hsbtech/teamwork-process-marketplace.git"
echo "  git push -u origin main"
