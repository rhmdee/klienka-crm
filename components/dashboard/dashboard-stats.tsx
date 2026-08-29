"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardStatsData, formatIDR } from "./types";

interface DashboardStatsProps {
  stats: DashboardStatsData;
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {/* 1. Active Deals */}
      <Card className="p-4 sm:p-5 bg-card border-border shadow-2xs rounded-2xl flex flex-col justify-between gap-4">
        <div className="flex items-start justify-between">
          <div className="flex flex-col items-start">
            <span className="text-sm font-semibold text-foreground">
              Active Deals
            </span>
            <span className="text-xs text-muted-foreground text-right">
              {stats.activeDealsCount} prospek aktif
            </span>
          </div>
          <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
            +{stats.totalDealsCount} total
          </span>
        </div>
        <span className="text-2xl font-extrabold tracking-tight text-foreground">
          {stats.activeDealsCount}
        </span>
      </Card>

      {/* 2. Nilai Pipeline Aktif */}
      <Card className="p-4 sm:p-5 bg-card border-border shadow-2xs rounded-2xl flex flex-col justify-between gap-4">
        <div className="flex items-start justify-between">
          <div className="flex flex-col items-start">
            <span className="text-sm font-semibold text-foreground">
              Nilai Pipeline
            </span>
            <span className="text-xs text-muted-foreground text-right">
              Estimasi berjalan
            </span>
          </div>
          <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
            Aktif
          </span>
        </div>
        <span className="text-2xl font-extrabold tracking-tight text-primary whitespace-nowrap">
          {formatIDR(stats.activePipelineValue)}
        </span>
      </Card>

      {/* 3. Closed Won */}
      <Card className="p-4 sm:p-5 bg-card border-border shadow-2xs rounded-2xl flex flex-col justify-between gap-4">
        <div className="flex items-start justify-between">
          <div className="flex flex-col items-start">
            <span className="text-sm font-semibold text-foreground">
              Closed Won Value
            </span>
            <span className="text-xs text-muted-foreground text-right">
              {stats.closedWonCount} deal berhasil
            </span>
          </div>
          <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-success/15 text-success border border-success/30">
            +{stats.closedWonCount}
          </span>
        </div>
        <span className="text-2xl font-extrabold tracking-tight text-foreground whitespace-nowrap">
          {formatIDR(stats.closedWonValue)}
        </span>
      </Card>

      {/* 4. Active Handoffs */}
      <Card className="p-4 sm:p-5 bg-card border-border shadow-2xs rounded-2xl flex flex-col justify-between gap-4">
        <div className="flex items-start justify-between">
          <div className="flex flex-col items-start">
            <span className="text-sm font-semibold text-foreground">
              Operasional Handoff
            </span>
            <span className="text-xs text-muted-foreground text-right">
              {stats.pendingHandoffs} menunggu PIC
            </span>
          </div>
          <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-warning/15 text-warning border border-warning/30">
            {stats.assignedHandoffs}/{stats.totalHandoffs} PIC
          </span>
        </div>
        <span className="text-2xl font-extrabold tracking-tight text-foreground">
          {stats.totalHandoffs}
        </span>
      </Card>
    </div>
  );
}

export function DashboardStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 animate-in fade-in duration-300">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card
          key={i}
          className="p-4 sm:p-5 bg-card border-border shadow-2xs rounded-2xl flex flex-col justify-between gap-4"
        >
          <div className="flex items-start justify-between">
            <div className="flex flex-col items-start gap-1">
              <Skeleton className="h-4 w-24 rounded-md" />
              <Skeleton className="h-3 w-28 rounded-md" />
            </div>
            <Skeleton className="h-5 w-12 rounded-full" />
          </div>
          <Skeleton className="h-8 w-28 rounded-md" />
        </Card>
      ))}
    </div>
  );
}
