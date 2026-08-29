"use client";

import { Button } from "@/components/ui/button";
import { Search, RefreshCw, Layers, List, Plus } from "lucide-react";
import { STAGES } from "./types";
import { cn } from "@/lib/utils";

interface PipelineHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterStage: string;
  onFilterStageChange: (stage: string) => void;
  viewMode: "kanban" | "list";
  onViewModeChange: (mode: "kanban" | "list") => void;
  onRefresh: () => void;
  onOpenCreateLead: () => void;
  isLoading: boolean;
}

export function PipelineHeader({
  searchQuery,
  onSearchChange,
  filterStage,
  onFilterStageChange,
  viewMode,
  onViewModeChange,
  onRefresh,
  onOpenCreateLead,
  isLoading,
}: PipelineHeaderProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Top Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Pipeline Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Lacak dan kelola prospek bisnis (Leads & Deals) dari tahap awal
            hingga penutupan.
          </p>
        </div>

        <Button
          onClick={onOpenCreateLead}
          className="gap-1.5 cursor-pointer h-9 shrink-0 self-start sm:self-auto"
        >
          <Plus className="size-4" />
          <span>Tambah Lead</span>
        </Button>
      </div>

      {/* Controls Bar: Switch View Mode -> Search -> Filter Stage -> Refresh */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1">
          {/* View Mode Toggle Switcher (Sebelum search box) */}
          <div className="flex items-center bg-muted/60 p-1 rounded-lg border border-border shrink-0">
            <button
              type="button"
              onClick={() => onViewModeChange("kanban")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer",
                viewMode === "kanban"
                  ? "bg-background text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Layers className="size-3.5" />
              <span>Kanban</span>
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange("list")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer",
                viewMode === "list"
                  ? "bg-background text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <List className="size-3.5" />
              <span>List View</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Cari prospek, nama klien, atau perusahaan..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="flex h-9 w-full rounded-md border border-border bg-background pl-9 pr-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent transition-colors"
            />
          </div>
        </div>

        {/* Filter Stage & Refresh Button */}
        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-muted-foreground whitespace-nowrap">
              Filter Stage:
            </label>
            <select
              value={filterStage}
              onChange={(e) => onFilterStageChange(e.target.value)}
              className="h-9 rounded-md border border-border bg-background px-3 py-1 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors cursor-pointer"
            >
              <option value="ALL">Semua Stage</option>
              {STAGES.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {/* Button Refresh (Setelah Filter Stage) */}
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
            className="gap-1.5 cursor-pointer h-9"
          >
            <RefreshCw
              className={`size-3.5 ${isLoading ? "animate-spin" : ""}`}
            />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
