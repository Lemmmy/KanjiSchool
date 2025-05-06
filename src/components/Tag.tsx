import { CloseOutlined } from "@ant-design/icons";
import { cn } from "@utils";
import { forwardRef } from "react";

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  closable?: boolean;
  onClose?: () => void;
  children: React.ReactNode;
}

export const Tag = forwardRef<HTMLSpanElement, TagProps>(
  ({ className, closable, onClose, children, ...props }, ref) => {
    return <span
      ref={ref}
      className={cn(
        "inline-block rounded-sm text-sm px-1.5",
        "text-white border-0 bg-white/20 light:bg-black/50",
        className
      )}
      {...props}
    >
      {children}
      {closable && <CloseOutlined className="ml-1" onClick={onClose} />}
    </span>;
  }
);
