"use client";

import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface AlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function AlertDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
}: AlertDialogProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onOpenChange(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={() => onOpenChange(false)}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      {/* Modal Dialog Box */}
      <div
        className={cn(
          "relative z-50 w-full max-w-lg rounded-2xl bg-card border border-border shadow-2xl p-6 overflow-hidden transition-all duration-300 animate-in zoom-in-95 fade-in",
          className,
        )}
      >
        {/* Header */}
        {(title || description) && (
          <div className="flex items-start justify-between pb-3 border-b border-border mb-4">
            <div className="flex flex-col gap-1">
              {title && (
                <h2 className="text-base font-bold text-foreground">{title}</h2>
              )}
              {description && (
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {description}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer shrink-0 -mt-1 -mr-1"
            >
              <X className="size-4" />
            </button>
          </div>
        )}

        {/* Content Body */}
        <div>{children}</div>
      </div>
    </div>
  );
}
