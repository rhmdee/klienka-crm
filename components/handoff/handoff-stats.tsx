"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { HandoffDealItem } from "./types";

interface HandoffStatsProps {
  deals: HandoffDealItem[];
  isLoading?: boolean;
}

export function HandoffStats({ deals, isLoading }: HandoffStatsProps) {
  const totalAssigned = deals.filter(
    (d) =>
      d.handoff &&
      d.handoff.assignedOperator &&
      d.handoff.assignedOperator !== "PENDING_ASSIGNMENT",
  ).length;
  const totalPending = deals.length - totalAssigned;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 animate-in fade-in duration-300">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card
            key={i}
            className="p-4 sm:p-5 bg-card border-border rounded-2xl flex flex-col justify-between gap-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex flex-col items-start gap-1">
                <Skeleton className="h-4 w-28 rounded-md" />
                <Skeleton className="h-3 w-20 rounded-md" />
              </div>
              <Skeleton className="h-5 w-12 rounded-full" />
            </div>
            <Skeleton className="h-8 w-16 rounded-md" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {/* Card 1: Total Deal Closed Won */}
      <Card className="p-4 sm:p-5 bg-card border-border shadow-2xs rounded-2xl flex flex-col justify-between gap-4">
        <div className="flex items-start justify-between">
          <div className="flex flex-col items-start">
            <span className="text-sm font-semibold text-foreground">
              Total Deal Won
            </span>
            <span className="text-xs text-muted-foreground text-right">
              Closed Won deals
            </span>
          </div>
          <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
            +{deals.length}
          </span>
        </div>
        <span className="text-2xl font-extrabold tracking-tight text-foreground">
          {deals.length}
        </span>
      </Card>

      {/* Card 2: Menunggu Penugasan */}
      <Card className="p-4 sm:p-5 bg-card border-border shadow-2xs rounded-2xl flex flex-col justify-between gap-4">
        <div className="flex items-start justify-between">
          <div className="flex flex-col items-start">
            <span className="text-sm font-semibold text-foreground">
              Menunggu Penugasan
            </span>
            <span className="text-xs text-muted-foreground text-right">
              Perlu PIC teknis
            </span>
          </div>
          <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-warning/15 text-warning border border-warning/30">
            Pending
          </span>
        </div>
        <span className="text-2xl font-extrabold tracking-tight text-warning">
          {totalPending}
        </span>
      </Card>

      {/* Card 3: Sudah Ditugaskan */}
      <Card className="p-4 sm:p-5 bg-card border-border shadow-2xs rounded-2xl flex flex-col justify-between gap-4">
        <div className="flex items-start justify-between">
          <div className="flex flex-col items-start">
            <span className="text-sm font-semibold text-foreground">
              Sudah Ditugaskan
            </span>
            <span className="text-xs text-muted-foreground text-right">
              Operator assigned
            </span>
          </div>
          <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-success/15 text-success border border-success/30">
            +{totalAssigned}
          </span>
        </div>
        <span className="text-2xl font-extrabold tracking-tight text-success">
          {totalAssigned}
        </span>
      </Card>
    </div>
  );
}
