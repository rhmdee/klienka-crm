"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BreadcrumbItem } from "@/types/main-content-types";

function formatSegmentLabel(segment: string) {
  return decodeURIComponent(segment)
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function AutoBreadcrumb({
  customItems,
  className,
}: {
  customItems?: BreadcrumbItem[] | null;
  className?: string;
}) {
  const pathname = usePathname();

  // Jika custom breadcrumbs disediakan
  if (customItems && customItems.length > 0) {
    return (
      <nav
        aria-label="Breadcrumb"
        className={cn("flex items-center gap-1.5 text-sm", className)}
      >
        {customItems.map((item, index) => {
          const isLast = index === customItems.length - 1;
          return (
            <div key={index} className="flex items-center gap-1.5">
              {index > 0 && (
                <ChevronRight className="size-3.5 text-muted-foreground/60 shrink-0" />
              )}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground transition-colors font-medium"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={cn(
                    "font-medium",
                    isLast
                      ? "text-foreground font-semibold"
                      : "text-muted-foreground",
                  )}
                >
                  {item.label}
                </span>
              )}
            </div>
          );
        })}
      </nav>
    );
  }

  // Generate otomatis dari URL Pathname App Router
  const segments = pathname
    ? pathname
        .split("/")
        .filter(
          (segment) =>
            segment.length > 0 &&
            !segment.startsWith("(") &&
            !segment.endsWith(")"),
        )
    : [];

  if (segments.length === 0) {
    return (
      <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
        Dashboard
      </div>
    );
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center gap-1.5 text-sm", className)}
    >
      <Link
        href="/dashboard"
        className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
        title="Dashboard"
      >
        <Home className="size-3.5" />
      </Link>

      {segments.map((segment, index) => {
        const href = `/${segments.slice(0, index + 1).join("/")}`;
        const isLast = index === segments.length - 1;
        const label = formatSegmentLabel(segment);

        return (
          <div key={href} className="flex items-center gap-1.5">
            <ChevronRight className="size-3.5 text-muted-foreground/60 shrink-0" />
            {isLast ? (
              <span className="font-semibold text-foreground truncate max-w-50 sm:max-w-xs">
                {label}
              </span>
            ) : (
              <Link
                href={href}
                className="text-muted-foreground hover:text-foreground transition-colors font-medium truncate max-w-37.5"
              >
                {label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
