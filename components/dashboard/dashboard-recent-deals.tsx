"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Layers } from "lucide-react";
import Link from "next/link";
import { formatIDR, getStageBadge, RecentDealItem } from "./types";

interface DashboardRecentDealsProps {
  deals: RecentDealItem[];
}

export function DashboardRecentDeals({ deals }: DashboardRecentDealsProps) {
  return (
    <Card className="p-4 sm:p-5 bg-card border-border shadow-2xs rounded-2xl flex flex-col justify-between gap-4 h-full">
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-primary/10 text-primary border border-primary/20 rounded-lg">
            <Layers className="size-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground">
              Prospek & Deal Terbaru
            </h2>
            <p className="text-xs text-muted-foreground">
              5 prospek yang baru diperbarui
            </p>
          </div>
        </div>

        <Link href="/pipeline">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs h-8 gap-1 text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <span>Semua</span>
            <ArrowRight className="size-3.5" />
          </Button>
        </Link>
      </div>

      <div className="flex-1 overflow-x-auto">
        {deals.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            Belum ada deal atau prospek yang tercatat.
          </div>
        ) : (
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="py-2 pr-4 font-medium">Judul Prospek</th>
                <th className="py-2 px-4 font-medium">Klien / Perusahaan</th>
                <th className="py-2 px-4 font-medium">Tahap</th>
                <th className="py-2 pl-4 text-right font-medium">Estimasi Nilai</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {deals.map((deal) => {
                const stage = getStageBadge(deal.stage);
                return (
                  <tr
                    key={deal.id}
                    className="hover:bg-muted/40 transition-colors"
                  >
                    <td className="py-2.5 pr-4">
                      <div className="font-semibold text-foreground line-clamp-1">
                        {deal.title}
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        PIC: {deal.user?.name || "Unassigned"}
                      </div>
                    </td>
                    <td className="py-2.5 px-4">
                      <div className="text-foreground">
                        {deal.client.companyName}
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        {deal.client.clientName}
                      </div>
                    </td>
                    <td className="py-2.5 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${stage.className}`}
                      >
                        {stage.label}
                      </span>
                    </td>
                    <td className="py-2.5 pl-4 text-right">
                      <span className="font-bold text-foreground whitespace-nowrap">
                        {formatIDR(deal.estimatedBudget)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </Card>
  );
}
