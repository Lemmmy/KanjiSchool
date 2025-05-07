import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@utils";

export const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md transition-all",
    "border border-solid font-normal select-none cursor-pointer",
    "disabled:pointer-events-none disabled:bg-grey-6/50 disabled:border-grey-5/50 disabled:text-grey-5",
    "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0",
    "outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
    "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  ],
  {
    variants: {
      variant: {
        // TODO[epic=anthill]: replace -blue-4, -red-5, etc. with sensible equivalents
        default: [
          "bg-container border-white/25 text-base-c hover:text-blue-4 hover:border-blue-4",
          "light:border-black/15",
        ],
        primary: [
          "bg-primary border-primary text-white hover:bg-blue-4 hover:border-blue-4"
        ],
        link: [
          "text-primary bg-transparent border-transparent underline-offset-4 hover:underline",
          "disabled:bg-transparent disabled:border-transparent",
        ],
      },
      size: {
        default: "h-8 px-4 py-2 has-[>svg]:px-3 text-base",
        small: "h-6 rounded-sm gap-1.5 px-2 has-[>svg]:px-2.5 text-sm",
        large: "h-10 rounded-lg px-4 has-[>svg]:px-4 text-lg",
        icon: "size-9",
      },
      danger: {
        true: "",
      },
    },
    compoundVariants: [
      {
        variant: "default",
        danger: true,
        className: "bg-container border-red-4 text-red-4 hover:text-red-3 hover:border-red-4/50"
      },
      {
        variant: "primary",
        danger: true,
        className: "bg-red-4 border-red-4 text-white hover:bg-red-3 hover:border-red-3"
      },
      {
        variant: "link",
        danger: true,
        className: "text-red-4 bg-transparent border-transparent underline-offset-4 hover:underline"
      }
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
      danger: false,
    },
  },
);

export interface ButtonProps extends React.ComponentProps<"button"> {
  variant?: VariantProps<typeof buttonVariants>["variant"];
  size?: VariantProps<typeof buttonVariants>["size"];
  danger?: boolean;
  asChild?: boolean;
}

export function Button({
  className,
  variant,
  size,
  danger,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, danger, className }))}
      {...props}
    />
  );
}
