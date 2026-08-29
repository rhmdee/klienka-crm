"use client";

import Link from "next/link";
import {
  ExternalLink,
  Building2,
  UserCheck,
  Clock,
  Briefcase,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { HandoffDealItem, formatIDR } from "./types";

interface HandoffTableProps {
  deals: HandoffDealItem[];
  isLoading: boolean;
}

export function HandoffTable({ deals, isLoading }: HandoffTableProps) {
  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full text-xs text-left border-collapse block md:table">
        <thead className="hidden md:table-header-group">
            <tr className="border-b border-border bg-muted/40 text-muted-foreground font-medium">
              <th className="py-3 px-4">Proyek & Klien</th>
              <th className="py-3 px-4">Tech Stack</th>
              <th className="py-3 px-4">Nilai Deal / SOW</th>
              <th className="py-3 px-4">Operator Penanggung Jawab</th>
              <th className="py-3 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="block p-1.5 lg:p-0 md:table-row-group divide-y md:divide-border md:divide-y">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i} className="animate-pulse block md:table-row mb-1.5 md:mb-0 border border-border rounded-lg lg:rounded-xl md:rounded-none overflow-hidden bg-card md:bg-transparent">
                  <td data-title="Proyek & Klien" className="flex items-center justify-between md:table-cell py-3 px-4 border-b border-border/50 md:border-0 before:content-[attr(data-title)] before:font-medium before:text-muted-foreground md:before:hidden last:border-0">
                    <div className="flex flex-col items-end md:items-start">
                      <Skeleton className="h-4 w-44 rounded-md mb-1.5" />
                      <Skeleton className="h-3 w-32 rounded-md" />
                    </div>
                  </td>
                  <td data-title="Tech Stack" className="flex items-center justify-between md:table-cell py-3 px-4 border-b border-border/50 md:border-0 before:content-[attr(data-title)] before:font-medium before:text-muted-foreground md:before:hidden last:border-0">
                    <Skeleton className="h-4 w-28 rounded-md" />
                  </td>
                  <td data-title="Nilai Deal / SOW" className="flex items-center justify-between md:table-cell py-3 px-4 border-b border-border/50 md:border-0 before:content-[attr(data-title)] before:font-medium before:text-muted-foreground md:before:hidden last:border-0">
                    <Skeleton className="h-4 w-24 rounded-md" />
                  </td>
                  <td data-title="Operator Penanggung Jawab" className="flex items-center justify-between md:table-cell py-3 px-4 border-b border-border/50 md:border-0 before:content-[attr(data-title)] before:font-medium before:text-muted-foreground md:before:hidden last:border-0">
                    <Skeleton className="h-5 w-32 rounded-full" />
                  </td>
                  <td data-title="Aksi" className="flex items-center justify-between md:table-cell py-3 px-4 border-b border-border/50 md:border-0 before:content-[attr(data-title)] before:font-medium before:text-muted-foreground md:before:hidden last:border-0 md:text-right">
                    <Skeleton className="h-7 w-20 rounded-md ml-auto" />
                  </td>
                </tr>
              ))
            ) : deals.length === 0 ? (
              <tr className="block md:table-row">
                <td
                  colSpan={5}
                  className="py-12 text-center text-muted-foreground block md:table-cell"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Briefcase className="size-8 text-muted-foreground/50" />
                    <span className="font-medium text-foreground">
                      Tidak ada data handoff yang ditemukan
                    </span>
                    <span className="text-xs">
                      Proyek akan muncul di sini setelah status deal berpindah
                      ke tahap Closed Won.
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              deals.map((deal) => {
                const isAssigned =
                  deal.handoff &&
                  deal.handoff.assignedOperator &&
                  deal.handoff.assignedOperator !== "PENDING_ASSIGNMENT";

                const approvedSOW =
                  deal.sows && deal.sows.length > 0 ? deal.sows[0] : null;

                return (
                  <tr
                    key={deal.id}
                    className="hover:bg-muted/30 transition-colors block md:table-row mb-1.5 md:mb-0 border border-border rounded-lg lg:rounded-xl md:rounded-none overflow-hidden bg-card md:bg-transparent shadow-2xs md:shadow-none"
                  >
                    {/* Proyek & Klien */}
                    <td data-title="Proyek & Klien" className="flex items-center justify-between md:table-cell py-3 px-4 border-b border-border/50 md:border-0 before:content-[attr(data-title)] before:font-medium before:text-muted-foreground md:before:hidden last:border-0">
                      <div className="flex flex-col gap-0.5 items-end md:items-start text-right md:text-left">
                        <Link
                          href={`/handoff/${deal.id}`}
                          className="font-semibold text-foreground hover:text-primary transition-colors text-sm"
                        >
                          {deal.title}
                        </Link>
                        <div className="flex items-center gap-1.5 text-muted-foreground text-[11px] justify-end md:justify-start">
                          <Building2 className="size-3 md:order-first order-last" />
                          <span>{deal.client.companyName}</span>
                          <span className="hidden md:inline">•</span>
                          <span className="md:hidden">-</span>
                          <span>{deal.client.clientName}</span>
                        </div>
                      </div>
                    </td>

                    {/* Tech Stack */}
                    <td data-title="Tech Stack" className="flex items-center justify-between md:table-cell py-3 px-4 border-b border-border/50 md:border-0 before:content-[attr(data-title)] before:font-medium before:text-muted-foreground md:before:hidden last:border-0">
                      <div className="flex flex-wrap gap-1 max-w-xs justify-end md:justify-start">
                        {deal.techStack && deal.techStack.length > 0 ? (
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
                          <span className="text-muted-foreground italic">
                            -
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Nilai Deal / SOW */}
                    <td data-title="Nilai Deal / SOW" className="flex items-center justify-between md:table-cell py-3 px-4 border-b border-border/50 md:border-0 before:content-[attr(data-title)] before:font-medium before:text-muted-foreground md:before:hidden last:border-0">
                      <div className="flex flex-col items-end md:items-start text-right md:text-left">
                        <span className="font-semibold text-primary">
                          {formatIDR(
                            approvedSOW?.totalCost || deal.estimatedBudget,
                          )}
                        </span>
                        {approvedSOW && (
                          <span className="text-[10px] text-muted-foreground">
                            SOW v{approvedSOW.version} (Margin:{" "}
                            {approvedSOW.marginPercentage}%)
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Operator Penanggung Jawab */}
                    <td data-title="PIC Operasional" className="flex items-center justify-between md:table-cell py-3 px-4 border-b border-border/50 md:border-0 before:content-[attr(data-title)] before:font-medium before:text-muted-foreground md:before:hidden last:border-0">
                      {isAssigned ? (
                        <Badge
                          variant="outline"
                          className="bg-success/10 text-success border-success/30 gap-1 px-2.5 py-0.5 text-xs font-medium"
                        >
                          <UserCheck className="size-3" />
                          <span>{deal.handoff?.assignedOperator}</span>
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="bg-warning/10 text-warning border-warning/30 gap-1 px-2.5 py-0.5 text-xs font-medium"
                        >
                          <Clock className="size-3" />
                          <span>Menunggu Penugasan</span>
                        </Badge>
                      )}
                    </td>

                    {/* Aksi */}
                    <td data-title="Aksi" className="flex items-center justify-between md:table-cell py-3 px-4 border-b border-border/50 md:border-0 before:content-[attr(data-title)] before:font-medium before:text-muted-foreground md:before:hidden last:border-0 md:text-right">
                      <Link href={`/handoff/${deal.id}`}>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs gap-1.5 cursor-pointer bg-muted md:bg-transparent"
                        >
                          <span>Buka Brief</span>
                          <ExternalLink className="size-3" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
    </div>
  );
}
