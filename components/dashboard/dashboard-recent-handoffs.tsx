"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Truck } from "lucide-react";
import Link from "next/link";
import { RecentHandoffItem } from "./types";

interface DashboardRecentHandoffsProps {
  handoffs: RecentHandoffItem[];
}

export function DashboardRecentHandoffs({
  handoffs,
}: DashboardRecentHandoffsProps) {
  return (
    <Card className="bg-card border-border shadow-2xs rounded-2xl flex flex-col justify-between gap-0 h-full p-0">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-success/10 text-success border border-success/20 rounded-lg">
            <Truck className="size-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground">
              Serah Terima Operasional
            </h2>
            <p className="text-xs text-muted-foreground">
              5 proyek serah terima terakhir
            </p>
          </div>
        </div>

        <Link href="/handoff">
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
        {handoffs.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            Belum ada proyek serah terima (Closed Won).
          </div>
        ) : (
          <table className="w-full text-left text-xs border-collapse block md:table">
            <thead className="hidden md:table-header-group">
              <tr className="border-b border-border bg-muted/40 text-muted-foreground">
                <th className="py-2 px-4 font-medium">Proyek / Klien</th>
                <th className="py-2 px-4 font-medium">PIC Operasional</th>
                <th className="py-2 px-4 text-right font-medium">
                  Status / Catatan
                </th>
              </tr>
            </thead>
            <tbody className="block p-1.5 lg:p-0 md:table-row-group divide-y md:divide-border md:divide-y">
              {handoffs.map((item) => {
                const isAssigned =
                  item.assignedOperator &&
                  item.assignedOperator !== "PENDING_ASSIGNMENT";

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-muted/40 transition-colors block md:table-row mb-1.5 md:mb-0 border border-border md:border-transparent md:border-b-border last:md:border-b-transparent rounded-lg lg:rounded-xl md:rounded-none overflow-hidden bg-card md:bg-transparent shadow-2xs md:shadow-none"
                  >
                    <td data-title="Proyek / Klien" className="flex items-center justify-between md:table-cell py-2.5 px-4 border-b border-border/50 md:border-0 before:content-[attr(data-title)] before:font-medium before:text-muted-foreground md:before:hidden last:border-0">
                      <div className="flex flex-col items-end md:items-start text-right md:text-left">
                        <div className="font-semibold text-foreground line-clamp-1">
                          {item.dealTitle}
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          {item.companyName}
                        </div>
                      </div>
                    </td>
                    <td data-title="PIC Operasional" className="flex items-center justify-between md:table-cell py-2.5 px-4 border-b border-border/50 md:border-0 before:content-[attr(data-title)] before:font-medium before:text-muted-foreground md:before:hidden last:border-0">
                      {isAssigned ? (
                        <div className="font-medium text-foreground line-clamp-1 md:text-left text-right">
                          {item.assignedOperator}
                        </div>
                      ) : (
                        <div className="text-muted-foreground italic line-clamp-1 md:text-left text-right">
                          Pending Assignment
                        </div>
                      )}
                    </td>
                    <td data-title="Status / Catatan" className="flex items-center justify-between md:table-cell py-2.5 px-4 md:text-right border-b border-border/50 md:border-0 before:content-[attr(data-title)] before:font-medium before:text-muted-foreground md:before:hidden last:border-0">
                      <span className="text-[11px] text-muted-foreground line-clamp-1 max-w-45 md:ml-auto md:text-right text-right">
                        {item.briefNotes || "Tidak ada catatan spesifik"}
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
