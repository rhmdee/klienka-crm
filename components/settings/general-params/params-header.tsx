"use client";

import { Button } from "@/components/ui/button";
import { Plus, RefreshCw, Search } from "lucide-react";

interface ParamsHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onRefresh: () => void;
  onAddParam: () => void;
  isLoading: boolean;
}

export function ParamsHeader({
  searchQuery,
  onSearchChange,
  onRefresh,
  onAddParam,
  isLoading,
}: ParamsHeaderProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Top Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Parameter Sistem
          </h1>
          <p className="text-sm text-muted-foreground">
            Konfigurasi variabel global, daftar operator teknis, dan rate card kalkulator CRM.
          </p>
        </div>

        <Button
          onClick={onAddParam}
          className="gap-1.5 cursor-pointer h-9 shrink-0 self-start sm:self-auto"
        >
          <Plus className="size-4" />
          <span>Tambah Parameter</span>
        </Button>
      </div>

      {/* Controls Bar: Search -> Refresh */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Cari kunci parameter, nilai, atau deskripsi..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="flex h-9 w-full rounded-md border border-border bg-background pl-9 pr-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent transition-colors"
          />
        </div>

        {/* Button Refresh */}
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isLoading}
          className="gap-1.5 cursor-pointer h-9 shrink-0 self-end sm:self-auto"
        >
          <RefreshCw
            className={`size-3.5 ${isLoading ? "animate-spin" : ""}`}
          />
          <span className="hidden sm:inline">Refresh</span>
        </Button>
      </div>
    </div>
  );
}
