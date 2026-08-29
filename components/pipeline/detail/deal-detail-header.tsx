"use client";

import Link from "next/link";
import { CheckCircle2, XCircle, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DealItem, DealStage, STAGES } from "../types";

import { useUserRole } from "@/hooks/use-user-role";

interface DealDetailHeaderProps {
  deal: DealItem;
  onUpdateStage: (stage: DealStage) => void;
  onRefresh: () => void;
  isLoading: boolean;
  isUpdating: boolean;
}

export function DealDetailHeader({
  deal,
  onUpdateStage,
  onRefresh,
  isLoading,
  isUpdating,
}: DealDetailHeaderProps) {
  const { canManagePipeline } = useUserRole();
  const currentStageInfo = STAGES.find((s) => s.key === deal.stage);

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-card border border-border p-4 rounded-xl shadow-xs">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2.5 flex-wrap">
          <h1 className="text-xl font-bold text-foreground">{deal.title}</h1>
          <Badge
            variant="outline"
            className={`${currentStageInfo?.badgeColor || "bg-muted text-foreground"} text-xs font-semibold px-2.5 py-0.5 rounded-full border-0`}
          >
            {currentStageInfo?.label || deal.stage}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          Perusahaan:{" "}
          <span className="font-semibold text-foreground">
            {deal.client.companyName}
          </span>
          <span className="mx-2">•</span>
          PIC:{" "}
          <span className="font-semibold text-foreground">
            {deal.user?.name || "Tim Klienka"}
          </span>
        </p>
      </div>

      {/* Action Buttons: Tandai Won, Tandai Lost, Refresh */}
      <div className="flex items-center gap-2 shrink-0">
        {deal.stage === "CLOSED_WON" ? (
          <Link href={`/handoff/${deal.id}`}>
            <Button
              size="sm"
              variant="default"
              className="gap-1.5 cursor-pointer bg-success text-success-foreground hover:bg-success/90"
            >
              <CheckCircle2 className="size-4" />
              <span>Buka Handoff Brief</span>
            </Button>
          </Link>
        ) : (
          canManagePipeline && (
            <>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => onUpdateStage("CLOSED_WON")}
                disabled={isUpdating}
                className="gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="size-4" />
                <span>Tandai Won</span>
              </Button>

              <Button
                size="sm"
                variant="destructive"
                onClick={() => onUpdateStage("CLOSED_LOST")}
                disabled={deal.stage === "CLOSED_LOST" || isUpdating}
                className="gap-1.5 cursor-pointer"
              >
                <XCircle className="size-4" />
                <span>Tandai Lost</span>
              </Button>
            </>
          )
        )}

        <Button
          size="icon-sm"
          variant="outline"
          onClick={onRefresh}
          disabled={isLoading || isUpdating}
          className="p-0 cursor-pointer"
          title="Refresh Data"
        >
          <RefreshCw
            className={`size-3.5 ${isLoading ? "animate-spin" : ""}`}
          />
        </Button>
      </div>
    </div>
  );
}
