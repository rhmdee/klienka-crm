"use client";

import { useAppStore } from "@/stores/useAppStore";

export const Backdrop = () => {
  const { setSidebarOpen, isSidebarOpen } = useAppStore();

  if (!isSidebarOpen) return null;

  return (
    <div
      role="presentation"
      onClick={() => setSidebarOpen(false)}
      className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300 animate-in fade-in"
      aria-hidden="true"
    />
  );
};
