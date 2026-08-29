"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreVertical,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { DealItem, DealStage, STAGES, STAGE_ORDER, formatIDR } from "./types";
import { useUserRole } from "@/hooks/use-user-role";

interface DealCardProps {
  deal: DealItem;
  onMoveStage: (dealId: string, stage: DealStage) => void;
  isUpdating?: boolean;
}

export function DealCard({ deal, onMoveStage, isUpdating }: DealCardProps) {
  const { canManagePipeline } = useUserRole();
  return (
    <div
      className={`p-3.5 rounded-lg bg-background border border-border shadow-xs hover:border-primary/50 transition-all flex flex-col gap-2.5 ${
        isUpdating ? "opacity-60 pointer-events-none" : ""
      }`}
    >
      {/* Top Header: Title & Actions */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-medium text-sm text-foreground leading-snug">
          {deal.title}
        </h3>

        <DropdownMenu>
          <DropdownMenuTrigger className="p-1 rounded hover:bg-muted text-muted-foreground transition-colors cursor-pointer outline-none shrink-0">
            <MoreVertical className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-48 bg-background border border-border p-1"
          >
            {canManagePipeline && (
              <>
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="text-xs text-muted-foreground px-2 py-1">
                    Pindah Tahap (Stage)
                  </DropdownMenuLabel>
                  {STAGES.map((s) => (
                    <DropdownMenuItem
                      key={s.key}
                      disabled={deal.stage === s.key}
                      onClick={() => onMoveStage(deal.id, s.key)}
                      className="text-xs px-2 py-1.5 cursor-pointer flex items-center justify-between"
                    >
                      <span>{s.label}</span>
                      {deal.stage === s.key && (
                        <CheckCircle2 className="size-3 text-secondary" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
              </>
            )}
            <Link
              href={`/pipeline/${deal.id}`}
              className="flex items-center justify-between text-xs px-2 py-1.5 rounded-sm hover:bg-muted text-primary transition-colors cursor-pointer"
            >
              <span>Lihat Detail</span>
              <ExternalLink className="size-3" />
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Client Info */}
      <div className="flex flex-col gap-0.5">
        <span className="text-xs font-medium text-muted-foreground">
          {deal.client.companyName}
        </span>
        <span className="text-[11px] text-muted-foreground/80">
          {deal.client.clientName}
          {deal.client.contactEmail ? ` • ${deal.client.contactEmail}` : ""}
        </span>
      </div>

      {/* Tech Stack Badges */}
      {deal.techStack && deal.techStack.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-0.5">
          {deal.techStack.slice(0, 3).map((tech) => (
            <Badge
              key={tech}
              variant="outline"
              className="text-[10px] px-1.5 py-0 font-normal bg-accent/40 text-foreground border-border"
            >
              {tech}
            </Badge>
          ))}
          {deal.techStack.length > 3 && (
            <span className="text-[10px] text-muted-foreground self-center">
              +{deal.techStack.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Footer: Budget & Quick Next Stage */}
      <div className="flex items-center justify-between pt-2 border-t border-border mt-1">
        <span className="text-xs font-semibold text-primary">
          {formatIDR(deal.estimatedBudget)}
        </span>

        {/* Quick button to next stage if available and authorized */}
        {canManagePipeline &&
          (() => {
            const currentIndex = STAGE_ORDER.indexOf(deal.stage);
            if (
              currentIndex >= 0 &&
              currentIndex < STAGE_ORDER.length - 1 &&
              deal.stage !== "CLOSED_WON" &&
              deal.stage !== "CLOSED_LOST"
            ) {
              const nextStage = STAGE_ORDER[currentIndex + 1];
              return (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 px-2 text-[11px] text-muted-foreground hover:text-foreground gap-1 cursor-pointer"
                  onClick={() => onMoveStage(deal.id, nextStage)}
                >
                  <span>Lanjut</span>
                  <ArrowRight className="size-3" />
                </Button>
              );
            }
            return null;
          })()}
      </div>
    </div>
  );
}
