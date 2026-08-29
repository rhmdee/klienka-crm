"use client";

import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function DashboardHeader() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isSpinning, setIsSpinning] = useState(false);

  const handleRefresh = () => {
    setIsSpinning(true);
    startTransition(() => {
      router.refresh();
      setTimeout(() => setIsSpinning(false), 600);
    });
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Dashboard Overview
        </h1>
        <p className="text-sm text-muted-foreground">
          Ringkasan performa penjualan, pipeline aktif, dan serah terima operasional software house.
        </p>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={handleRefresh}
        disabled={isPending || isSpinning}
        className="gap-1.5 cursor-pointer h-9 shrink-0 self-start sm:self-auto"
      >
        <RefreshCw
          className={`size-3.5 ${isPending || isSpinning ? "animate-spin" : ""}`}
        />
        <span>Refresh</span>
      </Button>
    </div>
  );
}
