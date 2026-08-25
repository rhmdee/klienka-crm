"use client";

import { useAppStore } from "@/stores/useAppStore";
import { cn } from "@/lib/utils";
import { Backdrop } from "@/components/layouts/sidebar/backdrop";
import { AppName } from "@/components/layouts/app-name";
import { Navigation } from "@/components/layouts/sidebar/navigation";
import { UserInfo } from "@/components/layouts/sidebar/user-info";

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const { isSidebarOpen, isSidebarExpand } = useAppStore();

  return (
    <>
      {/* Mobile Backdrop Overlay (only active when sidebar is open on mobile/tablet portrait) */}
      <Backdrop />

      <aside
        className={cn(
          // Base & Mobile (< lg): fixed positioning with translate-x animation
          "fixed top-2 bottom-2 left-2 z-50 flex flex-col bg-background rounded-2xl border border-border transition-[width,transform] duration-300 ease-in-out overflow-hidden shadow-2xl",
          "w-72 max-w-[calc(100vw-1rem)]",
          isSidebarOpen ? "translate-x-0" : "-translate-x-[calc(100%+1rem)]",

          // Tablet Landscape & Desktop (lg:): remove fixed (static), always visible (translate-0), toggle width expand/collapse
          "lg:static lg:top-auto lg:bottom-auto lg:left-auto lg:z-auto lg:shadow-none lg:translate-x-0 lg:h-full shrink-0",
          isSidebarExpand ? "lg:w-64" : "lg:w-18",
          className,
        )}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="h-14 flex items-center justify-between px-4 border-b border-border shrink-0">
            {/* Logo / Brand & Desktop Expand-Collapse Trigger */}
            <AppName className="w-full" onHeader={false} />
          </div>

          {/* Sidebar Navigation / Content */}
          <Navigation />

          {/* user info */}
          <UserInfo />
        </div>
      </aside>
    </>
  );
}
