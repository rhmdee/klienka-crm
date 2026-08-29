"use client";

import { Button } from "@/components/ui/button";
import { Plus, RefreshCw, Search } from "lucide-react";
import { ROLES } from "./types";

interface UserHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterRole: string;
  onFilterRoleChange: (role: string) => void;
  onRefresh: () => void;
  onAddUser: () => void;
  isLoading: boolean;
}

export function UserHeader({
  searchQuery,
  onSearchChange,
  filterRole,
  onFilterRoleChange,
  onRefresh,
  onAddUser,
  isLoading,
}: UserHeaderProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Top Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            User Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Kelola data akun pengguna, peran, dan hak akses (RBAC) pada sistem CRM.
          </p>
        </div>

        <Button
          onClick={onAddUser}
          className="gap-1.5 cursor-pointer h-9 shrink-0 self-start sm:self-auto"
        >
          <Plus className="size-4" />
          <span>Tambah Pengguna</span>
        </Button>
      </div>

      {/* Controls Bar: Search -> Filter Role -> Refresh */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Cari nama atau email pengguna..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="flex h-9 w-full rounded-md border border-border bg-background pl-9 pr-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent transition-colors"
            />
          </div>
        </div>

        {/* Filter Role & Refresh Button */}
        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-muted-foreground whitespace-nowrap">
              Filter Role:
            </label>
            <select
              value={filterRole}
              onChange={(e) => onFilterRoleChange(e.target.value)}
              className="h-9 rounded-md border border-border bg-background px-3 py-1 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors cursor-pointer"
            >
              <option value="ALL">Semua Role</option>
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          {/* Button Refresh */}
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
