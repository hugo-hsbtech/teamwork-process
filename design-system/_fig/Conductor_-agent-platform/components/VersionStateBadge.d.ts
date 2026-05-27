import * as React from 'react';
export interface VersionStateBadgeProps {
  className?: string;
  style?: React.CSSProperties;
  state?: "Draft" | "Staging" | "Canary" | "Production" | "Running" | "Failed" | "Paused";
}
export declare const VersionStateBadge: React.FC<VersionStateBadgeProps>;
export default VersionStateBadge;
