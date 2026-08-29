"use client";

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface HandoffFilterControlsProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterStatus: "ALL" | "ASSIGNED" | "PENDING";
  onFilterStatusChange: (status: "ALL" | "ASSIGNED" | "PENDING") => void;
  totalCount: number;
  pendingCount: number;
  assignedCount: number;
}

export function HandoffFilterControls({
  searchQuery,
  onSearchChange,
  filterStatus,
  onFilterStatusChange,
  totalCount,
  pendingCount,
  assignedCount,
}: HandoffFilterControlsProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
      <div className="relative w-full sm:w-80">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Cari proyek, klien, atau operator..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8 text-xs h-8"
        />
      </div>

      <div className="flex items-center gap-1.5 w-full sm:w-auto">
        <Button
          size="sm"
          variant={filterStatus === "ALL" ? "default" : "outline"}
          onClick={() => onFilterStatusChange("ALL")}
          className="h-8 text-xs cursor-pointer px-3 flex-1 sm:flex-none"
        >
          Semua ({totalCount})
        </Button>
        <Button
          size="sm"
          variant={filterStatus === "PENDING" ? "default" : "outline"}
          onClick={() => onFilterStatusChange("PENDING")}
          className="h-8 text-xs cursor-pointer px-3 flex-1 sm:flex-none"
        >
          Pending ({pendingCount})
        </Button>
        <Button
          size="sm"
          variant={filterStatus === "ASSIGNED" ? "default" : "outline"}
          onClick={() => onFilterStatusChange("ASSIGNED")}
          className="h-8 text-xs cursor-pointer px-3 flex-1 sm:flex-none"
        >
          Assigned ({assignedCount})
        </Button>
      </div>
    </div>
  );
}
