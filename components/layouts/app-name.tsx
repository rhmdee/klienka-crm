"use client";

import { useAppStore } from "@/stores/useAppStore";
import { Button } from "@/components/ui/button";
import { Menu, PanelLeftClose, PanelLeftOpen, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface AppNameProps {
  className?: string;
  onHeader?: boolean;
}

export const AppName = ({ className, onHeader = true }: AppNameProps) => {
  const { isSidebarExpand } = useAppStore();
  return (
    <div
      className={cn(
        "flex items-center gap-2.5 overflow-hidden justify-center",
        className,
      )}
    >
      {isSidebarExpand && (
        <div className="flex w-full item-center gap-2">
          {onHeader && <ButtonOpen />}
          <span className="font-bold text-lg whitespace-nowrap transition-all duration-300  text-primary flex items-center dark:text-foreground">
            Klienka CRM
          </span>
        </div>
      )}
      <div>
        <ButtonExpand />
        {!onHeader && <ButtonExit />}
      </div>
    </div>
  );
};

const ButtonOpen = () => {
  const { setSidebarOpen, isSidebarOpen } = useAppStore();
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setSidebarOpen(true)}
      aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
      className="cursor-pointer rounded-xl border-border hover:bg-accent"
    >
      <Menu className="size-4 text-foreground" />
    </Button>
  );
};

const ButtonExpand = () => {
  const { toggleSidebarExpand, isSidebarExpand } = useAppStore();
  return (
    <Button
      variant="ghost"
      size="icon-lg"
      onClick={() => toggleSidebarExpand()}
      aria-label={isSidebarExpand ? "Collapse sidebar" : "Expand sidebar"}
      title={isSidebarExpand ? "Collapse sidebar" : "Expand sidebar"}
      className={cn(
        "hidden lg:flex cursor-pointer text-muted-foreground hover:text-foreground hover:bg-muted/80 rounded-xl",
        !isSidebarExpand && "mx-auto",
      )}
    >
      {isSidebarExpand ? (
        <PanelLeftClose className="size-4.5" />
      ) : (
        <PanelLeftOpen className="size-4.5" />
      )}
    </Button>
  );
};

const ButtonExit = () => {
  const { setSidebarOpen } = useAppStore();
  return (
    <Button
      variant="ghost"
      size="icon-xs"
      onClick={() => setSidebarOpen(false)}
      aria-label="Close sidebar"
      className="cursor-pointer text-muted-foreground hover:text-foreground rounded-xl lg:hidden"
    >
      <X className="size-4" />
    </Button>
  );
};
