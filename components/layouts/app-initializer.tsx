"use client";

import { useEffect } from "react";
import { useAppStore } from "@/stores/useAppStore";

export const AppInitializer = ({ children }: { children: React.ReactNode }) => {
  const theme = useAppStore((state) => state.theme);
  const setDevice = useAppStore((state) => state.setDevice);

  // 1. Sync & Handle Theme (Dark Mode)
  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = (targetTheme: "light" | "dark") => {
      if (targetTheme === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    };

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      applyTheme(systemTheme);

      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = (e: MediaQueryListEvent) => {
        applyTheme(e.matches ? "dark" : "light");
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    } else {
      applyTheme(theme);
    }
  }, [theme]);

  // 2. Window Resize Listener untuk Device Detection & Auto-Collapse Sidebar
  useEffect(() => {
    const handleResize = () => {
      setDevice(window.innerWidth);
    };

    // Trigger awal saat mount
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setDevice]);

  return <>{children}</>;
};
