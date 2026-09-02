"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function Sheet({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
}: SheetProps) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onOpenChange(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  // Lock body scroll when sheet is open
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-stretch justify-center sm:justify-end">
      {/* Backdrop */}
      <div
        onClick={() => onOpenChange(false)}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      {/* Drawer Content: Bottom Sheet on Mobile, Slide-over Right on Desktop */}
      <div
        className={cn(
          "relative z-50 flex max-h-[85vh] sm:max-h-full h-auto sm:h-full w-full max-w-full sm:max-w-md flex-col bg-background rounded-t-2xl sm:rounded-none border-t border-border sm:border-t-0 sm:border-l shadow-2xl p-5 overflow-y-auto transition-transform duration-300 animate-in slide-in-from-bottom sm:slide-in-from-right",
          className,
        )}
      >
        {/* Mobile handle drag bar */}
        <div className="mx-auto w-10 h-1 rounded-full bg-muted-foreground/30 -mt-1 mb-3 sm:hidden shrink-0" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border mb-4 shrink-0">
          <div className="flex flex-col gap-0.5">
            {title && (
              <h2 className="text-base font-semibold text-foreground">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 flex flex-col">{children}</div>
      </div>
    </div>
  );
}
