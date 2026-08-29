"use client";

import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface HandoffHeaderProps {
  onRefresh: () => void;
  isLoading: boolean;
}

export function HandoffHeader({ onRefresh, isLoading }: HandoffHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Operational Handoff
        </h1>
        <p className="text-sm text-muted-foreground">
          Transisi spesifikasi teknis dan penunjukan penanggung jawab operasional untuk deal Closed Won.
        </p>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={onRefresh}
        disabled={isLoading}
        className="gap-1.5 cursor-pointer h-9 shrink-0 self-start sm:self-auto"
      >
        <RefreshCw
          className={`size-3.5 ${isLoading ? "animate-spin" : ""}`}
        />
        <span>Refresh</span>
      </Button>
    </div>
  );
}
