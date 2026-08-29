"use client";

import { Code2, Briefcase, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { HandoffDealItem, formatIDR } from "./types";

interface HandoffBriefSpecProps {
  deal: HandoffDealItem;
}

export function HandoffBriefSpec({ deal }: HandoffBriefSpecProps) {
  const approvedSOW = deal.sows && deal.sows.length > 0 ? deal.sows[0] : null;

  return (
    <div className="flex flex-col gap-4">
      {/* Card 1: Project Overview & Tech Stack */}
      <Card className="p-4 sm:p-5 border-border bg-card flex flex-col gap-4 shadow-xs">
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <div className="size-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <Briefcase className="size-4" />
          </div>
          <div>
            <h2 className="font-semibold text-sm text-foreground">
              Spesifikasi & Kebutuhan Proyek
            </h2>
            <p className="text-[11px] text-muted-foreground">
              Informasi ringkasan ruang lingkup yang disepakati dari tahap Discovery
            </p>
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1.5 text-xs">
          <span className="text-muted-foreground font-medium">
            Deskripsi Kebutuhan:
          </span>
          <p className="text-foreground leading-relaxed bg-muted/30 p-3 rounded-lg border border-border">
            {deal.description ||
              "Kebutuhan proyek telah disetujui sesuai kesepakatan akhir pada tahap Negosiasi."}
          </p>
        </div>

        {/* Tech Stack */}
        <div className="flex flex-col gap-1.5 text-xs pt-2 border-t border-border/60">
          <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
            <Code2 className="size-3.5 text-primary" />
            <span>Rencana Tech Stack & Arsitektur:</span>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {deal.techStack && deal.techStack.length > 0 ? (
              deal.techStack.map((tech) => (
                <Badge
                  key={tech}
                  variant="secondary"
                  className="text-xs px-2.5 py-0.5 font-normal"
                >
                  {tech}
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground italic">
                Belum ada tech stack khusus
              </span>
            )}
          </div>
        </div>
      </Card>

      {/* Card 2: Approved SOW Specification (Read-Only / Frozen) */}
      <Card className="p-4 sm:p-5 border-border bg-card flex flex-col gap-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <div className="size-7 rounded-lg bg-success/10 text-success flex items-center justify-center">
              <Lock className="size-4" />
            </div>
            <div>
              <h2 className="font-semibold text-sm text-foreground">
                Dokumen SOW Terkunci (Approved SOW Brief)
              </h2>
              <p className="text-[11px] text-muted-foreground">
                Spesifikasi alokasi man-days & biaya yang telah disetujui klien (BR-HND-01 & BR-HND-02)
              </p>
            </div>
          </div>

          {approvedSOW && (
            <Badge variant="outline" className="bg-background text-xs">
              Versi {approvedSOW.version}
            </Badge>
          )}
        </div>

        {approvedSOW && approvedSOW.items && approvedSOW.items.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-muted-foreground font-medium">
                  <th className="py-2.5 px-3">Peran Teknis</th>
                  <th className="py-2.5 px-3 text-center">Man-Days</th>
                  <th className="py-2.5 px-3 text-right">Tarif Harian</th>
                  <th className="py-2.5 px-3 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {approvedSOW.items.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/20">
                    <td className="py-2.5 px-3 font-medium text-foreground">
                      {item.roleName}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="bg-primary/10 text-primary font-semibold px-2 py-0.5 rounded-md">
                        {item.manDays} MD
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right text-muted-foreground">
                      {formatIDR(item.dailyRate)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-medium text-foreground">
                      {formatIDR(item.subtotal)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-border bg-muted/20">
                  <td
                    colSpan={3}
                    className="py-2.5 px-3 text-right font-semibold text-muted-foreground"
                  >
                    Total Nilai Penawaran (Final Deal):
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-primary text-sm">
                    {formatIDR(approvedSOW.totalCost)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        ) : (
          <div className="p-3 bg-muted/30 rounded-lg text-xs text-muted-foreground">
            Total Budget Disetujui:{" "}
            <strong className="text-primary">
              {formatIDR(deal.estimatedBudget)}
            </strong>
          </div>
        )}
      </Card>
    </div>
  );
}
