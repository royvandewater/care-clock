import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/cn";
import type { JSX } from "preact";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium cursor-pointer ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary-hover",
        danger: "bg-danger text-danger-foreground hover:bg-danger/90",
        outline: "border border-input bg-background hover:text-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary-hover",
        tertiary: "hover:bg-tertiary-hover",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        xs: "h-8 px-3 py-1",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: VariantProps<typeof buttonVariants>["variant"];
  size?: VariantProps<typeof buttonVariants>["size"];
}

const Button = ({ className, variant, size, ...props }: ButtonProps) => {
  return <button {...props} className={cn(buttonVariants({ variant, size, className }))} />;
};
Button.displayName = "Button";

export { Button, buttonVariants };
