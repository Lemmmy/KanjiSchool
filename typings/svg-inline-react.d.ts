declare module "svg-inline-react" {
  import * as React from "react";

  export interface InlineSVGProps extends React.HTMLProps<HTMLSVGElement> {
    element?: string;
    src: string;
    raw?: boolean;
  }

  declare class InlineSVG extends React.Component<InlineSVGProps, any> {}
  export default InlineSVG;
}
