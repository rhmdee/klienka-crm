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
    <Card className="bg-card border-border shadow-2xs rounded-2xl flex flex-col justify-between gap-0 h-full p-0">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
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
          <table className="w-full text-left text-xs border-collapse block md:table">
            <thead className="hidden md:table-header-group">
              <tr className="border-b border-border bg-muted/40 text-muted-foreground">
                <th className="py-2 px-4 font-medium">Judul Prospek</th>
                <th className="py-2 px-4 font-medium">Klien / Perusahaan</th>
                <th className="py-2 px-4 font-medium">Tahap</th>
                <th className="py-2 px-4 text-right font-medium">
                  Estimasi Nilai
                </th>
              </tr>
            </thead>
            <tbody className="block p-1.5 lg:p-0 md:table-row-group divide-y md:divide-border md:divide-y">
              {deals.map((deal) => {
                const stage = getStageBadge(deal.stage);
                return (
                  <tr
                    key={deal.id}
                    className="hover:bg-muted/40 transition-colors block md:table-row mb-1.5 md:mb-0 border border-border md:border-transparent md:border-b-border last:md:border-b-transparent rounded-lg lg:rounded-xl md:rounded-none overflow-hidden bg-card md:bg-transparent shadow-2xs md:shadow-none"
                  >
                    <td data-title="Judul Prospek" className="flex items-center justify-between md:table-cell py-2.5 px-4 border-b border-border/50 md:border-0 before:content-[attr(data-title)] before:font-medium before:text-muted-foreground md:before:hidden last:border-0">
                      <div className="flex flex-col items-end md:items-start text-right md:text-left">
                        <div className="font-semibold text-foreground line-clamp-1">
                          {deal.title}
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          PIC: {deal.user?.name || "Unassigned"}
                        </div>
                      </div>
                    </td>
                    <td data-title="Klien / Perusahaan" className="flex items-center justify-between md:table-cell py-2.5 px-4 border-b border-border/50 md:border-0 before:content-[attr(data-title)] before:font-medium before:text-muted-foreground md:before:hidden last:border-0">
                      <div className="flex flex-col items-end md:items-start text-right md:text-left">
                        <div className="text-foreground">
                          {deal.client.companyName}
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          {deal.client.clientName}
                        </div>
                      </div>
                    </td>
                    <td data-title="Tahap" className="flex items-center justify-between md:table-cell py-2.5 px-4 border-b border-border/50 md:border-0 before:content-[attr(data-title)] before:font-medium before:text-muted-foreground md:before:hidden last:border-0">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${stage.className}`}
                      >
                        {stage.label}
                      </span>
                    </td>
                    <td data-title="Estimasi Nilai" className="flex items-center justify-between md:table-cell py-2.5 px-4 md:text-right border-b border-border/50 md:border-0 before:content-[attr(data-title)] before:font-medium before:text-muted-foreground md:before:hidden last:border-0">
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
