import * as React from 'react';
export interface ProgressStepRowProps {
  className?: string;
  style?: React.CSSProperties;
  state?: "done" | "active" | "pending";
}
export declare const ProgressStepRow: React.FC<ProgressStepRowProps>;
export default ProgressStepRow;
