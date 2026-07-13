import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "outline" | "destructive";
export type ButtonSize = "sm" | "md" | "lg" | "icon";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "border-transparent bg-[var(--accent)] !text-[var(--accent-ink)] shadow-[0_10px_30px_rgba(134,204,54,.2)] hover:bg-[var(--accent-hover)] hover:shadow-[0_16px_38px_rgba(134,204,54,.27)] active:bg-[var(--accent-active)] active:shadow-none",
  secondary: "border-[var(--border-strong)] bg-[var(--surface-elevated)] !text-white shadow-sm hover:border-white/20 hover:bg-[#171e2b] active:bg-[var(--surface)]",
  ghost: "border-transparent bg-transparent !text-[var(--control-muted)] hover:bg-[var(--control-surface-hover)] hover:!text-[var(--control-text)] active:bg-[var(--control-surface-hover)]",
  outline: "border-[var(--control-border)] bg-[var(--control-surface)] !text-[var(--control-text)] shadow-sm hover:bg-[var(--control-surface-hover)] active:bg-[var(--control-surface-hover)]",
  destructive: "border-red-700 bg-red-700 !text-white shadow-sm hover:border-red-600 hover:bg-red-600 active:bg-red-800",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-10 rounded-[11px] px-3.5 text-xs [&_svg]:size-4",
  md: "h-11 rounded-xl px-5 text-sm [&_svg]:size-4",
  lg: "h-14 rounded-full px-7 text-sm [&_svg]:size-[18px]",
  icon: "h-11 w-11 rounded-xl p-0 [&_svg]:size-[18px]",
};

export function buttonVariants({ variant = "primary", size = "md", className }: { variant?: ButtonVariant; size?: ButtonSize; className?: string } = {}) {
  return cn(
    "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap border font-bold tracking-[-.01em] transition-[color,background-color,border-color,box-shadow,transform] duration-200 ease-out outline-none hover:-translate-y-0.5 active:translate-y-0 active:scale-[.985] disabled:pointer-events-none disabled:translate-y-0 disabled:scale-100 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-[var(--control-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--control-focus-offset)] motion-reduce:transform-none motion-reduce:transition-none [&_svg]:pointer-events-none [&_svg]:shrink-0",
    variantClasses[variant],
    sizeClasses[size],
    className,
  );
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  isLoading?: boolean;
  loadingLabel?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { asChild = false, isLoading = false, loadingLabel = "Carregando", variant = "primary", size = "md", className, type, disabled, children, ...props },
  ref,
) {
  const useSlot = asChild && !isLoading;
  const Component = useSlot ? Slot : "button";
  return (
    <Component
      ref={ref}
      type={useSlot ? undefined : (type ?? "button")}
      className={buttonVariants({ variant, size, className: cn(isLoading && "cursor-wait", className) })}
      disabled={useSlot ? undefined : (disabled || isLoading)}
      aria-busy={isLoading || undefined}
      {...props}
    >
      {isLoading ? <><span aria-hidden="true" className="h-4 w-4 rounded-full border-2 border-current border-r-transparent animate-[control-spinner_.7s_linear_infinite] motion-reduce:animate-none" />{loadingLabel}</> : children}
    </Component>
  );
});
