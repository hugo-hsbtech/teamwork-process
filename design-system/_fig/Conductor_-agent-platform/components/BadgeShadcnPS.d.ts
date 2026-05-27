import * as React from 'react';
export interface BadgeShadcnPSProps {
  className?: string;
  style?: React.CSSProperties;
  state?: "production" | "draft" | "staging" | "canary" | "running" | "error" | "paused";
}
export declare const BadgeShadcnPS: React.FC<BadgeShadcnPSProps>;
export default BadgeShadcnPS;
