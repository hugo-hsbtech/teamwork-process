import * as React from 'react';
export interface BlockGridSentinelProps {
  className?: string;
  style?: React.CSSProperties;
  state?: "loading-more" | "end";
}
export declare const BlockGridSentinel: React.FC<BlockGridSentinelProps>;
export default BlockGridSentinel;
