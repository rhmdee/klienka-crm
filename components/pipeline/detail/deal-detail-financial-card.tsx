"use client";

import { DollarSign } from "lucide-react";
import { Card } from "@/components/ui/card";
import { DealItem, formatIDR } from "../types";

interface DealDetailFinancialCardProps {
  deal: DealItem;
}

export function DealDetailFinancialCard({ deal }: DealDetailFinancialCardProps) {
  return (
    <Card className="p-4 border-border bg-card flex flex-col gap-3">
      <div className="flex items-center gap-2 border-b border-border pb-2.5">
        <DollarSign className="size-4 text-primary" />
        <h2 className="font-semibold text-sm text-foreground">
          Detail Nilai & Finansial
        </h2>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-xs text-muted-foreground">
          Estimasi Nilai Pipeline
        </span>
        <div className="text-2xl font-bold text-primary">
          {formatIDR(deal.estimatedBudget)}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-border/60 text-xs">
        <div>
          <span className="text-muted-foreground">Tanggal Dibuat:</span>
          <p className="font-medium text-foreground mt-0.5">
            {deal.createdAt
              ? new Date(deal.createdAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              : "-"}
          </p>
        </div>
        <div>
          <span className="text-muted-foreground">Pembaruan Terakhir:</span>
          <p className="font-medium text-foreground mt-0.5">
            {deal.updatedAt
              ? new Date(deal.updatedAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              : "-"}
          </p>
        </div>
      </div>
    </Card>
  );
}
