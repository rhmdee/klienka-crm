"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Clock, Truck } from "lucide-react";
import Link from "next/link";
import { RecentHandoffItem } from "./types";

interface DashboardRecentHandoffsProps {
  handoffs: RecentHandoffItem[];
}

export function DashboardRecentHandoffs({
  handoffs,
}: DashboardRecentHandoffsProps) {
  return (
    <Card className="p-4 sm:p-5 bg-card border-border shadow-2xs rounded-2xl flex flex-col justify-between gap-4 h-full">
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-center gap-2">
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
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="py-2 pr-4 font-medium">Proyek / Klien</th>
                <th className="py-2 px-4 font-medium">PIC Operasional</th>
                <th className="py-2 pl-4 text-right font-medium">
                  Status / Catatan
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {handoffs.map((item) => {
                const isAssigned =
                  item.assignedOperator &&
                  item.assignedOperator !== "PENDING_ASSIGNMENT";

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-muted/40 transition-colors"
                  >
                    <td className="py-2.5 pr-4">
                      <div className="font-semibold text-foreground line-clamp-1">
                        {item.dealTitle}
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        {item.companyName}
                      </div>
                    </td>
                    <td className="py-2.5 px-4">
                      {isAssigned ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-success/15 text-success border border-success/30">
                          <CheckCircle2 className="size-3" />
                          <span>{item.assignedOperator}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-warning/15 text-warning border border-warning/30">
                          <Clock className="size-3" />
                          <span>Pending Assignment</span>
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 pl-4 text-right">
                      <span className="text-[11px] text-muted-foreground line-clamp-1 max-w-45 ml-auto">
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
