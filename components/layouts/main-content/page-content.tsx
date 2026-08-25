"use client";

import { useContentTopStore } from "@/stores/useMainContentStore";
import { cn } from "@/lib/utils";
import type { PageContentProps } from "@/types/main-content-types";

export function PageContent({
  children,
  className,
  noPadding: propNoPadding,
  padding: propPadding,
}: PageContentProps) {
  const storeNoPadding = useContentTopStore((state) => state.noPadding);
  const storePadding = useContentTopStore((state) => state.padding);

  const isNoPadding = propNoPadding ?? storeNoPadding ?? false;
  const customPadding = propPadding ?? storePadding;

  return (
    <div
      className={cn(
        "flex-1 overflow-y-auto min-h-0",
        isNoPadding ? "p-0" : (customPadding ?? "p-4 sm:p-6"),
        className
      )}
    >
      {children}
    </div>
  );
}

export default PageContent;
