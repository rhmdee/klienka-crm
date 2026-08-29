"use client";

import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {/* 1. Total Prospek */}
      <Card className="p-4 sm:p-5 bg-card border-border shadow-2xs rounded-2xl flex flex-col justify-between gap-4">
        <div className="flex items-start justify-between">
          <div className="flex flex-col items-start">
            <span className="text-sm font-semibold text-foreground">
              Total Prospek
            </span>
            <span className="text-xs text-muted-foreground text-right">
              {stats.activeCount} prospek aktif
            </span>
          </div>
          <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
            +{stats.totalDeals}
          </span>
        </div>
        <span className="text-2xl font-extrabold tracking-tight text-foreground">
          {stats.totalDeals}
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
          {formatIDR(stats.totalActiveValue)}
        </span>
      </Card>

      {/* 3. Closed Won */}
      <Card className="p-4 sm:p-5 bg-card border-border shadow-2xs rounded-2xl flex flex-col justify-between gap-4">
        <div className="flex items-start justify-between">
          <div className="flex flex-col items-start">
            <span className="text-sm font-semibold text-foreground">
              Closed Won
            </span>
            <span className="text-xs text-muted-foreground text-right">
              {stats.wonCount} deal menang
            </span>
          </div>
          <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-success/15 text-success border border-success/30">
            +{stats.wonCount}
          </span>
        </div>
        <span className="text-2xl font-extrabold tracking-tight text-foreground whitespace-nowrap">
          {formatIDR(stats.wonValue)}
        </span>
      </Card>

      {/* 4. Win Rate */}
      <Card className="p-4 sm:p-5 bg-card border-border shadow-2xs rounded-2xl flex flex-col justify-between gap-4">
        <div className="flex items-start justify-between">
          <div className="flex flex-col items-start">
            <span className="text-sm font-semibold text-foreground">
              Win Rate
            </span>
            <span className="text-xs text-muted-foreground text-right">
              Rasio deal berhasil
            </span>
          </div>
          <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-success/15 text-success border border-success/30">
            Rate
          </span>
        </div>
        <span className="text-2xl font-extrabold tracking-tight text-foreground">
          {stats.totalDeals > 0
            ? `${Math.round((stats.wonCount / stats.totalDeals) * 100)}%`
            : "0%"}
        </span>
      </Card>
    </div>
  );
}

export function PipelineStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 animate-in fade-in duration-300">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card
          key={i}
          className="p-4 sm:p-5 bg-card border-border rounded-2xl flex flex-col justify-between gap-4"
        >
          <div className="flex items-start justify-between">
            <div className="flex flex-col items-start gap-1">
              <Skeleton className="h-4 w-24 rounded-md" />
              <Skeleton className="h-3 w-28 rounded-md" />
            </div>
            <Skeleton className="h-5 w-10 rounded-full" />
          </div>
          <Skeleton className="h-8 w-24 rounded-md" />
        </Card>
      ))}
    </div>
  );
}
