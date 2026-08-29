"use client";

import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Briefcase, DollarSign, CheckCircle2, TrendingUp } from "lucide-react";
import { DealItem, formatIDR } from "./types";

interface PipelineStatsProps {
  deals: DealItem[];
}

export function PipelineStats({ deals }: PipelineStatsProps) {
  const stats = useMemo(() => {
    const totalDeals = deals.length;
    const activeDeals = deals.filter(
      (d) => d.stage !== "CLOSED_WON" && d.stage !== "CLOSED_LOST",
    );
    const totalActiveValue = activeDeals.reduce(
      (sum, d) => sum + Number(d.estimatedBudget || 0),
      0,
    );
    const wonDeals = deals.filter((d) => d.stage === "CLOSED_WON");
    const wonValue = wonDeals.reduce(
      (sum, d) => sum + Number(d.estimatedBudget || 0),
      0,
    );

    return {
      totalDeals,
      activeCount: activeDeals.length,
      totalActiveValue,
      wonCount: wonDeals.length,
      wonValue,
    };
  }, [deals]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
      <Card className="p-4 bg-background border-border">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">
            Total Prospek
          </span>
          <Briefcase className="size-4 text-muted-foreground" />
        </div>
        <div className="text-2xl font-bold text-foreground mt-2">
          {stats.totalDeals}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {stats.activeCount} prospek aktif berjalan
        </p>
      </Card>

      <Card className="p-4 bg-background border-border">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">
            Nilai Pipeline Aktif
          </span>
          <DollarSign className="size-4 text-primary" />
        </div>
        <div className="text-2xl font-bold text-primary mt-2">
          {formatIDR(stats.totalActiveValue)}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Total estimasi prospek aktif
        </p>
      </Card>

      <Card className="p-4 bg-background border-border">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">
            Closed Won
          </span>
          <CheckCircle2 className="size-4 text-secondary" />
        </div>
        <div className="text-xl font-bold text-foreground mt-2">
          {formatIDR(stats.wonValue)}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {stats.wonCount} deal berhasil dimenangkan
        </p>
      </Card>

      <Card className="p-4 bg-background border-border">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">
            Win Rate
          </span>
          <TrendingUp className="size-4 text-primary" />
        </div>
        <div className="text-2xl font-bold text-foreground mt-2">
          {stats.totalDeals > 0
            ? `${Math.round((stats.wonCount / stats.totalDeals) * 100)}%`
            : "0%"}
        </div>
        <p className="text-xs text-muted-foreground mt-1">Rasio deal berhasil</p>
      </Card>
    </div>
  );
}

export function PipelineStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 animate-in fade-in duration-300">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="p-4 bg-background border-border flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-3.5 w-24 rounded-md" />
            <Skeleton className="size-4 rounded-md" />
          </div>
          <Skeleton className="h-7 w-32 rounded-md mt-1" />
          <Skeleton className="h-3 w-36 rounded-md" />
        </Card>
      ))}
    </div>
  );
}
