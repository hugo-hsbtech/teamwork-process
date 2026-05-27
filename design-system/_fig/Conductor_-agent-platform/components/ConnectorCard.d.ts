import * as React from 'react';
export interface ConnectorCardProps {
  className?: string;
  style?: React.CSSProperties;
  selected?: "false" | "true";
}
export declare const ConnectorCard: React.FC<ConnectorCardProps>;
export default ConnectorCard;
