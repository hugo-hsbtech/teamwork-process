import * as React from 'react';
export interface ProviderChipProps {
  className?: string;
  style?: React.CSSProperties;
  provider?: "Claude" | "OpenAI" | "Gemini" | "Grok";
}
export declare const ProviderChip: React.FC<ProviderChipProps>;
export default ProviderChip;
