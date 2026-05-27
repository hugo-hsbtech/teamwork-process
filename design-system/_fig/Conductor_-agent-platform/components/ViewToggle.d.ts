import * as React from 'react';
export interface ViewToggleProps {
  className?: string;
  style?: React.CSSProperties;
  view?: "Blocks" | "Table";
}
export declare const ViewToggle: React.FC<ViewToggleProps>;
export default ViewToggle;
