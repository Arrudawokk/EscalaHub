"use client";

import { useEffect, useRef } from "react";
import { trackInitiateCheckout, trackViewContent, type AnalyticsProduct } from "@/lib/analytics";

type ProductEventTrackerProps = {
  event: "ViewContent" | "InitiateCheckout";
  product: AnalyticsProduct;
};

export function ProductEventTracker({ event, product }: ProductEventTrackerProps) {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;
    if (event === "ViewContent") trackViewContent(product);
    else trackInitiateCheckout(product);
  }, [event, product]);

  return null;
}
