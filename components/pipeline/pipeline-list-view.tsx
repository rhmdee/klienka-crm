"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DealItem, DealStage, STAGES, formatIDR } from "./types";
import { ChevronDown, ExternalLink } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface PipelineListViewProps {
  deals: DealItem[];
  onMoveStage: (dealId: string, stage: DealStage) => void;
  updatingDealId: string | null;
}

export function PipelineListView({
  deals,
  onMoveStage,
  updatingDealId,
}: PipelineListViewProps) {
  // Default open all stages that have deals, or at least the first 3 stages
  const defaultOpenStages = useMemo(() => {
    const active = STAGES.filter((s) =>
      deals.some((d) => d.stage === s.key),
    ).map((s) => s.key);
    return active.length > 0
      ? active
      : ["INQUIRY", "DISCOVERY_CALL", "SOW_ESTIMATION"];
  }, [deals]);

  return (
    <div className="w-full flex flex-col gap-2.5">
      <Accordion defaultValue={defaultOpenStages} className="space-y-2.5">
        {STAGES.map((stage) => {
          const stageDeals = deals.filter((d) => d.stage === stage.key);
          const stageTotal = stageDeals.reduce(
            (sum, d) => sum + Number(d.estimatedBudget || 0),
            0,
          );

          return (
            <AccordionItem
              key={stage.key}
              value={stage.key}
              className="border border-border rounded-xl bg-card overflow-hidden shadow-xs transition-all not-last:border-b"
            >
              <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/40 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full pr-3 gap-2 text-left">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-sm text-foreground uppercase tracking-wider">
                      {stage.label}
                    </span>
                    <Badge
                      variant="outline"
                      className={`${stage.badgeColor || "bg-muted text-foreground"} text-xs font-semibold px-2 py-0.5 rounded-full border-0`}
                    >
                      {stageDeals.length} Prospek
                    </Badge>
                    <span className="text-xs text-muted-foreground hidden md:inline">
                      • {stage.description}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-muted-foreground">Total Nilai:</span>
                    <span className="font-bold text-foreground text-sm">
                      {formatIDR(stageTotal)}
                    </span>
                  </div>
                </div>
              </AccordionTrigger>

              <AccordionContent className="p-0 border-t border-border/80 bg-background/50">
                {stageDeals.length === 0 ? (
                  <div className="text-center py-6 text-xs text-muted-foreground italic">
                    Belum ada prospek pada tahap {stage.label}.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-border text-[11px] font-semibold text-muted-foreground uppercase bg-muted/20">
                          <th className="py-2.5 px-4">Prospek / Proyek</th>
                          <th className="py-2.5 px-4">Klien & Kontak</th>
                          <th className="py-2.5 px-4">Tech Stack</th>
                          <th className="py-2.5 px-4 text-right">
                            Estimasi Nilai
                          </th>
                          <th className="py-2.5 px-4 text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60 text-xs">
                        {stageDeals.map((deal) => {
                          const isUpdating = updatingDealId === deal.id;

                          return (
                            <tr
                              key={deal.id}
                              className={`hover:bg-muted/30 transition-colors ${
                                isUpdating
                                  ? "opacity-50 pointer-events-none"
                                  : ""
                              }`}
                            >
                              {/* Prospek Title */}
                              <td className="py-3 px-4 font-medium text-foreground">
                                <Link
                                  href={`/pipeline/${deal.id}`}
                                  className="hover:text-primary transition-colors block"
                                >
                                  {deal.title}
                                </Link>
                                <span className="text-[11px] text-muted-foreground">
                                  PIC: {deal.user?.name || "Tim Klienka"}
                                </span>
                              </td>

                              {/* Client Info */}
                              <td className="py-3 px-4 text-muted-foreground">
                                <div className="font-medium text-foreground">
                                  {deal.client.companyName}
                                </div>
                                <div className="text-[11px]">
                                  {deal.client.clientName} (
                                  {deal.client.contactEmail || "-"})
                                </div>
                              </td>

                              {/* Tech Stack */}
                              <td className="py-3 px-4">
                                <div className="flex flex-wrap gap-1 max-w-xs">
                                  {deal.techStack &&
                                  deal.techStack.length > 0 ? (
                                    deal.techStack.map((tech) => (
                                      <Badge
                                        key={tech}
                                        variant="outline"
                                        className="text-[10px] px-1.5 py-0 font-normal bg-accent/40 text-foreground border-border"
                                      >
                                        {tech}
                                      </Badge>
                                    ))
                                  ) : (
                                    <span className="text-muted-foreground italic text-[11px]">
                                      -
                                    </span>
                                  )}
                                </div>
                              </td>

                              {/* Budget */}
                              <td className="py-3 px-4 text-right font-semibold text-primary">
                                {formatIDR(deal.estimatedBudget)}
                              </td>

                              {/* Actions */}
                              <td className="py-3 px-4 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  {/* Dropdown Change Stage */}
                                  <DropdownMenu>
                                    <DropdownMenuTrigger className="inline-flex items-center justify-center gap-1 rounded-md border border-border bg-background px-2 py-1 text-xs font-medium text-foreground hover:bg-muted transition-colors cursor-pointer h-7">
                                      <span>Ubah Stage</span>
                                      <ChevronDown className="size-3" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                      align="end"
                                      className="w-44 bg-background border border-border"
                                    >
                                      {STAGES.map((s) => (
                                        <DropdownMenuItem
                                          key={s.key}
                                          disabled={deal.stage === s.key}
                                          onClick={() =>
                                            onMoveStage(deal.id, s.key)
                                          }
                                          className="text-xs cursor-pointer"
                                        >
                                          {s.label}
                                        </DropdownMenuItem>
                                      ))}
                                    </DropdownMenuContent>
                                  </DropdownMenu>

                                  <Link href={`/pipeline/${deal.id}`}>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="text-xs gap-1.5 h-7 px-2"
                                    >
                                      <span>Detail</span>
                                      <ExternalLink className="size-3.5" />
                                    </Button>
                                  </Link>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}

export function PipelineListViewSkeleton() {
  return (
    <div className="w-full flex flex-col gap-2.5 animate-in fade-in duration-300">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="border border-border rounded-xl bg-card overflow-hidden shadow-xs p-4 flex flex-col gap-3"
        >
          {/* Header Row Skeleton */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <Skeleton className="h-4 w-32 rounded-md" />
              <Skeleton className="h-5 w-16 rounded-md" />
              <Skeleton className="h-3 w-40 rounded-md hidden md:inline" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-3 w-20 rounded-md" />
              <Skeleton className="h-4 w-28 rounded-md" />
            </div>
          </div>

          {/* Table Rows Skeleton */}
          {i < 2 && (
            <div className="pt-2 border-t border-border flex flex-col gap-2">
              {Array.from({ length: 2 }).map((_, j) => (
                <div
                  key={j}
                  className="p-3 bg-muted/20 rounded-lg flex items-center justify-between gap-4"
                >
                  <div className="flex flex-col gap-1.5 flex-1">
                    <Skeleton className="h-3.5 w-48 rounded-md" />
                    <Skeleton className="h-2.5 w-32 rounded-md" />
                  </div>
                  <div className="flex-col gap-1 flex-1 hidden sm:flex">
                    <Skeleton className="h-3.5 w-36 rounded-md" />
                    <Skeleton className="h-2.5 w-28 rounded-md" />
                  </div>
                  <Skeleton className="h-4 w-24 rounded-md" />
                  <Skeleton className="h-7 w-20 rounded-md" />
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
