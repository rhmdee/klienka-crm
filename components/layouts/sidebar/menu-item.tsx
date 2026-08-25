"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/stores/useAppStore";
import { icons, HelpCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export type IconName = keyof typeof icons;

export interface MenuItemProps {
  href: string;
  icon: IconName;
  label: string;
  active?: boolean;
}

export function MenuItem({ href, icon, label, active }: MenuItemProps) {
  const { isSidebarExpand } = useAppStore();
  const pathname = usePathname();

  // Auto-detect active route if not explicitly provided
  const isActive =
    active !== undefined
      ? active
      : pathname === href || (href !== "/" && pathname?.startsWith(href));

  // Resolve Lucide Icon component dynamically from icon name
  const IconComponent = icons[icon] || HelpCircle;

  const itemLink = (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2 h-10 rounded-xl transition-all duration-200 cursor-pointer text-sm font-medium",
        isActive
          ? "bg-primary text-primary-foreground font-semibold shadow-2xs"
          : "text-muted-foreground hover:bg-accent hover:text-foreground",
        !isSidebarExpand ? "w-10 justify-center px-0 mx-auto" : "w-full px-3",
      )}
    >
      <IconComponent className="size-4.5" />
      {isSidebarExpand && <span className="truncate">{label}</span>}
    </Link>
  );

  // Jika sidebar expand = false: render icon dengan Tooltip
  if (!isSidebarExpand) {
    return (
      <li className="flex justify-center w-full">
        <Tooltip>
          <TooltipTrigger render={itemLink} delay={200} />
          <TooltipContent
            side="right"
            sideOffset={8}
            className="flex items-center gap-1.5 font-medium shadow-md"
          >
            <IconComponent className="size-3.5" />
            <span>{label}</span>
          </TooltipContent>
        </Tooltip>
      </li>
    );
  }

  // Jika sidebar expand = true: render menu-item biasa tanpa Tooltip
  return <li className="flex w-full">{itemLink}</li>;
}
