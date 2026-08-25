"use client";

import { useAppStore, type ThemeMode } from "@/stores/useAppStore";
import { toggleThemeWithWave } from "@/lib/theme-transition";
import { cn } from "@/lib/utils";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle({ className }: { className?: string }) {
  const theme = useAppStore((state) => state.theme);

  const themes: { key: ThemeMode; label: string; icon: typeof Sun }[] = [
    { key: "light", label: "Light", icon: Sun },
    { key: "dark", label: "Dark", icon: Moon },
  ];

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 p-1 bg-muted/60 rounded-xl border border-border/50 backdrop-blur-xs",
        className
      )}
    >
      {themes.map(({ key, label, icon: Icon }) => {
        const isActive = theme === key;
        return (
          <button
            key={key}
            type="button"
            onClick={(e) => toggleThemeWithWave(key, e)}
            title={`Switch to ${label} theme`}
            aria-label={`Switch to ${label} theme`}
            className={cn(
              "p-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer flex items-center justify-center",
              isActive
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-background/40"
            )}
          >
            <Icon className="w-4 h-4" />
          </button>
        );
      })}
    </div>
  );
}
