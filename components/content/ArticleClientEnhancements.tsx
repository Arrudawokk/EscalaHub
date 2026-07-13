"use client";

import dynamic from "next/dynamic";

const ReadingProgress = dynamic(() => import("./ReadingProgress"), { ssr: false });

export function ArticleClientEnhancements() {
  return <ReadingProgress />;
}
