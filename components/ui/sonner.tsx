"use client";

import { ComponentProps } from "react";
import { Toaster as Sonner, toast as sonnerToast } from "sonner";
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  X,
} from "lucide-react";

type ToasterProps = ComponentProps<typeof Sonner>;

export function Toaster({ ...props }: ToasterProps) {
  return (
    <Sonner
      className="toaster group"
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:rounded-xl group-[.toaster]:p-3.5 group-[.toaster]:gap-2.5",
          description: "group-[.toast]:text-muted-foreground text-xs",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          closeButton:
            "group-[.toast]:bg-background/80 group-[.toast]:border-border group-[.toast]:text-foreground group-[.toast]:hover:bg-muted cursor-pointer",
          success:
            "group-[.toaster]:!bg-on-success group-[.toaster]:!border-border-success group-[.toaster]:!text-success",
          error:
            "group-[.toaster]:!bg-on-destructive group-[.toaster]:!border-border-destructive group-[.toaster]:!text-destructive",
          warning:
            "group-[.toaster]:!bg-on-warning group-[.toaster]:!border-border-warning group-[.toaster]:!text-warning",
          info:
            "group-[.toaster]:!bg-on-info group-[.toaster]:!border-border-info group-[.toaster]:!text-info",
        },
      }}
      icons={{
        success: <CheckCircle2 className="size-4 shrink-0 text-success" />,
        error: <AlertCircle className="size-4 shrink-0 text-destructive" />,
        warning: <AlertTriangle className="size-4 shrink-0 text-warning" />,
        info: <Info className="size-4 shrink-0 text-info" />,
        close: <X className="size-3.5" />,
      }}
      {...props}
    />
  );
}

export const toast = {
  // Success toast: auto close dalam 3 detik (3000ms)
  success: (
    message: string,
    options?: Parameters<typeof sonnerToast.success>[1],
  ) =>
    sonnerToast.success(message, {
      duration: 3000,
      closeButton: false,
      ...options,
    }),

  // Error toast: tidak auto close (duration: Infinity) dengan action close manual icon X
  error: (message: string, options?: Parameters<typeof sonnerToast.error>[1]) =>
    sonnerToast.error(message, {
      duration: Infinity,
      closeButton: true,
      ...options,
    }),

  // Warning toast: tidak auto close (duration: Infinity) dengan action close manual icon X
  warning: (
    message: string,
    options?: Parameters<typeof sonnerToast.warning>[1],
  ) =>
    sonnerToast.warning(message, {
      duration: Infinity,
      closeButton: true,
      ...options,
    }),

  // Info toast: tidak auto close (duration: Infinity) dengan action close manual icon X
  info: (message: string, options?: Parameters<typeof sonnerToast.info>[1]) =>
    sonnerToast.info(message, {
      duration: Infinity,
      closeButton: true,
      ...options,
    }),

  message: (
    message: string,
    options?: Parameters<typeof sonnerToast>[1],
  ) => sonnerToast(message, options),

  dismiss: sonnerToast.dismiss,
};
