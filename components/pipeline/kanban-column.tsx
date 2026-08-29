"use client";

import { DealCard } from "./deal-card";
import { DealItem, DealStage, StageConfig, formatIDR } from "./types";

interface KanbanColumnProps {
  stage: StageConfig;
  deals: DealItem[];
  onMoveStage: (dealId: string, stage: DealStage) => void;
  updatingDealId: string | null;
}

export function KanbanColumn({
  stage,
  deals,
  onMoveStage,
  updatingDealId,
}: KanbanColumnProps) {
  const totalAmount = deals.reduce(
    (sum, d) => sum + Number(d.estimatedBudget || 0),
    0,
  );

  return (
    <div className="shrink-0 w-80 bg-accent/30 rounded-xl border border-border flex flex-col gap-2.5 p-3.5 max-h-[calc(100vh-210px)] overflow-y-auto">
      {/* Column Header */}
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-xs text-foreground uppercase tracking-wide">
            {stage.label}
          </span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium ${stage.badgeColor}`}
          >
            {deals.length}
          </span>
        </div>
      </div>

      {/* Column Subhead: Total Value */}
      <div className="flex items-center justify-between text-xs text-muted-foreground pb-1">
        <span>Total Nilai:</span>
        <span className="font-semibold text-foreground">
          {formatIDR(totalAmount)}
        </span>
      </div>

      {/* Cards List */}
      <div className="flex flex-col gap-2.5 flex-1 overflow-y-auto pt-1">
        {deals.length === 0 ? (
          <div className="text-center py-8 text-xs text-muted-foreground border border-dashed border-border rounded-lg bg-background/50">
            Tidak ada prospek
          </div>
        ) : (
          deals.map((deal) => (
            <DealCard
              key={deal.id}
              deal={deal}
              onMoveStage={onMoveStage}
              isUpdating={updatingDealId === deal.id}
            />
          ))
        )}
      </div>
    </div>
  );
}
