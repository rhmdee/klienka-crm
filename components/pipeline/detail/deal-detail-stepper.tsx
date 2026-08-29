"use client";

import { CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { DealItem, DealStage, STAGES, STAGE_ORDER } from "../types";

interface DealDetailStepperProps {
  deal: DealItem;
  onUpdateStage: (stage: DealStage) => void;
  isUpdating: boolean;
}

export function DealDetailStepper({
  deal,
  onUpdateStage,
  isUpdating,
}: DealDetailStepperProps) {
  const currentIdx = STAGE_ORDER.indexOf(deal.stage);

  return (
    <Card className="p-4 border-border bg-card">
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Tahapan Progres Pipeline
        </span>
        <span className="text-xs text-muted-foreground">
          Klik tahap untuk memindahkan status
        </span>
      </div>

      {/* Stepper Container */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 pt-1">
        {STAGE_ORDER.map((stageKey, idx) => {
          const stageInfo = STAGES.find((s) => s.key === stageKey);
          const isCurrent = deal.stage === stageKey;
          const isPassed = currentIdx !== -1 && currentIdx > idx;

          return (
            <button
              key={stageKey}
              type="button"
              disabled={isUpdating || deal.stage === "CLOSED_LOST"}
              onClick={() => onUpdateStage(stageKey)}
              className={`flex items-center gap-2 p-2.5 rounded-lg border text-left transition-all cursor-pointer disabled:cursor-not-allowed ${
                isCurrent
                  ? "bg-primary/10 border-primary text-primary font-semibold shadow-xs ring-1 ring-primary"
                  : isPassed
                    ? "bg-muted/40 border-border text-foreground hover:bg-muted"
                    : "bg-background border-border/80 text-muted-foreground hover:bg-muted/30"
              }`}
            >
              <div
                className={`size-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                  isCurrent
                    ? "bg-primary text-primary-foreground"
                    : isPassed
                      ? "bg-secondary text-secondary-foreground"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {isPassed ? (
                  <CheckCircle2 className="size-4" />
                ) : (
                  <span>{idx + 1}</span>
                )}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-medium truncate">
                  {stageInfo?.label || stageKey}
                </span>
                <span className="text-[10px] text-muted-foreground truncate">
                  {idx === 0
                    ? "Prospek baru masuk"
                    : idx === 1
                      ? "Kualifikasi kebutuhan"
                      : idx === 2
                        ? "Penyusunan estimasi biaya"
                        : idx === 3
                          ? "Tahap negosiasi kontrak"
                          : "Deal berhasil didapatkan"}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </Card>
  );
}
