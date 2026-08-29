"use client";

import ThemeToggle from "@/components/layouts/theme-toggle";
import { RoleSwitcher } from "@/components/layouts/header/role-switcher";
import { cn } from "@/lib/utils";
import { AppName } from "./app-name";

interface HeaderProps {
  className?: string;
}

export default function Header({ className }: HeaderProps) {
  return (
    <header
      className={cn(
        "h-16 px-4 bg-background rounded-2xl border border-border flex items-center justify-between gap-3 lg:hidden shrink-0",
        className,
      )}
    >
      <AppName onHeader />

      <div className="flex items-center gap-2">
        <RoleSwitcher />
        <ThemeToggle />
      </div>
    </header>
  );
}
