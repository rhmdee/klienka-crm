"use client";

import ThemeToggle from "@/components/layouts/theme-toggle";
import { cn } from "@/lib/utils";
import { useContentTopStore } from "@/stores/useMainContentStore";
import { AutoBreadcrumb } from "@/components/layouts/main-content/auto-breadcrumb";
import type { ContentTopProps } from "@/types/main-content-types";

export const ContentTop = ({
  className,
  title: propTitle,
  breadcrumbs: propBreadcrumbs,
  actions: propActions,
  children: propChildren,
}: ContentTopProps) => {
  const storeTitle = useContentTopStore((state) => state.title);
  const storeBreadcrumbs = useContentTopStore((state) => state.breadcrumbs);
  const storeActions = useContentTopStore((state) => state.actions);
  const storeExtra = useContentTopStore((state) => state.extraContent);

  const activeTitle = propTitle ?? storeTitle;
  const activeBreadcrumbs = propBreadcrumbs ?? storeBreadcrumbs;
  const activeActions = propActions ?? storeActions;
  const activeExtra = propChildren ?? storeExtra;

  return (
    <header
      className={cn(
        "flex items-center justify-between px-4 sm:px-6 h-14 border-b border-border bg-background/95 backdrop-blur-xs shrink-0 gap-4",
        className,
      )}
    >
      {/* Sisi Kiri: Title atau Auto Breadcrumb */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {activeTitle ? (
          typeof activeTitle === "string" ? (
            <h1 className="text-base font-semibold text-foreground truncate">
              {activeTitle}
            </h1>
          ) : (
            activeTitle
          )
        ) : (
          <AutoBreadcrumb customItems={activeBreadcrumbs} />
        )}

        {/* Extra Content di tengah/kiri */}
        {activeExtra && (
          <div className="hidden md:flex items-center gap-2">{activeExtra}</div>
        )}
      </div>

      {/* Sisi Kanan: Action Buttons (Searchbox, New Button, dsb) + ThemeToggle */}
      <div className="flex items-center gap-2.5 shrink-0">
        {activeActions && (
          <div className="flex items-center gap-2">{activeActions}</div>
        )}

        {/* Theme Toggle (desktop) */}
        <ThemeToggle className="hidden lg:flex" />
      </div>
    </header>
  );
};

export default ContentTop;
