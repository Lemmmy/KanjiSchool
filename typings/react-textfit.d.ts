declare module "react-textfit" {
  import * as React from "react";

  export interface TextfitProps {
    mode?: "single" | "multi";
    min?: number;
    max?: number;
    forceSingleModeWidth?: boolean;
    throttle?: number;
    onReady?: () => void;
    children: React.ReactNode;
  }

  declare class Textfit extends React.Component<TextfitProps, any> {}
  export { Textfit };
}
