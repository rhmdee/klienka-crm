"use client";

import { useEffect } from "react";
import { useContentTopStore } from "@/stores/useMainContentStore";
import type { ContentTopSlotProps } from "@/types/main-content-types";

/**
 * Gunakan komponen ini di dalam file `page.tsx` untuk mengkustomisasi
 * bagian ContentTop dan padding PageContent secara dinamis per-halaman.
 */
export function ContentTopSlot({
  title,
  breadcrumbs,
  actions,
  children,
  noPadding,
  padding,
}: ContentTopSlotProps) {
  const setContentTop = useContentTopStore((state) => state.setContentTop);
  const resetContentTop = useContentTopStore((state) => state.resetContentTop);

  useEffect(() => {
    setContentTop({
      title: title ?? null,
      breadcrumbs: breadcrumbs ?? null,
      actions: actions ?? null,
      extraContent: children ?? null,
      noPadding: noPadding ?? null,
      padding: padding ?? null,
    });

    return () => {
      resetContentTop();
    };
  }, [
    title,
    breadcrumbs,
    actions,
    children,
    noPadding,
    padding,
    setContentTop,
    resetContentTop,
  ]);

  return null;
}
