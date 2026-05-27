import * as React from 'react';
export interface ResultChipProps {
  className?: string;
  style?: React.CSSProperties;
  state?: "success" | "error" | "pending";
}
export declare const ResultChip: React.FC<ResultChipProps>;
export default ResultChip;
