import Image from "next/image";
import { cn } from "@/lib/cn";

type BrandLogoProps = {
  className?: string;
  imageClassName?: string;
  wordmarkClassName?: string;
  showWordmark?: boolean;
};

export function BrandLogo({ className, imageClassName, wordmarkClassName, showWordmark = true }: BrandLogoProps) {
  return (
    <span className={cn("brand-logo", className)}>
      <Image
        src="/brand/logo.png"
        alt=""
        aria-hidden="true"
        width={1536}
        height={1024}
        sizes="66px"
        unoptimized
        className={cn("brand-logo-image", imageClassName)}
      />
      {showWordmark ? <span className={cn("brand-wordmark", wordmarkClassName)}>EscalaHub</span> : null}
    </span>
  );
}
