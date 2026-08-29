"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BreadcrumbItem } from "@/types/main-content-types";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isIdSegment(segment: string) {
  return UUID_REGEX.test(segment) || (segment.length >= 20 && !segment.includes(" "));
}

function formatSegmentLabel(segment: string, prevSegment?: string) {
  // Jika segmen berupa UUID / Hash ID, ubah ke label yang informatif dan ramah pengguna
  if (isIdSegment(segment)) {
    const prev = prevSegment?.toLowerCase();
    if (prev === "pipeline") return "Detail Prospek";
    if (prev === "handoff") return "Handoff Brief";
    if (prev === "leads") return "Detail Lead";
    if (prev === "sow") return "Detail SOW";
    return "Detail";
  }

  // Label khusus untuk kata kunci sistem
  const lower = segment.toLowerCase();
  if (lower === "sow") return "SOW Estimator";
  if (lower === "pipeline") return "Pipeline";
  if (lower === "handoff") return "Handoff";
  if (lower === "leads") return "Leads";
  if (lower === "dashboard") return "Dashboard";

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
        const prevSegment = index > 0 ? segments[index - 1] : undefined;
        const label = formatSegmentLabel(segment, prevSegment);

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
