import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type BadgeVariant = "success" | "neutral" | "info" | "warning" | "danger";

const badgeVariants: Record<BadgeVariant, string> = {
  success: "border-[#B8FF5C]/30 bg-[#B8FF5C]/10 text-[#DFFFBA]",
  neutral: "border-white/15 bg-white/10 text-zinc-100",
  info: "border-[#3B82F6]/30 bg-[#3B82F6]/10 text-blue-100",
  warning: "border-amber-400/25 bg-amber-400/10 text-amber-100",
  danger: "border-red-400/25 bg-red-400/10 text-red-100",
};

export function Badge({ variant = "neutral", className, ...props }: HTMLAttributes<HTMLSpanElement> & { variant?: BadgeVariant }) {
  return <span className={cn("inline-flex min-h-7 items-center gap-1.5 rounded-full border px-3 py-1 text-[9px] font-extrabold uppercase leading-none tracking-[.1em] shadow-[inset_0_1px_rgba(255,255,255,.035)] [&_svg]:size-3.5 [&_svg]:shrink-0", badgeVariants[variant], className)} {...props} />;
}
