import * as React from 'react';
export interface StepperProps {
  className?: string;
  style?: React.CSSProperties;
  type?: "Takeover/Horizontal" | "Drawer/Compact";
}
export declare const Stepper: React.FC<StepperProps>;
export default Stepper;
