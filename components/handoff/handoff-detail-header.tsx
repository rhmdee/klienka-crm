"use client";

import Link from "next/link";
import { Lock, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HandoffDealItem } from "./types";

interface HandoffDetailHeaderProps {
  deal: HandoffDealItem;
}

export function HandoffDetailHeader({ deal }: HandoffDetailHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-card border border-border p-4 rounded-xl shadow-xs">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2.5 flex-wrap">
          <h1 className="text-xl font-bold text-foreground">{deal.title}</h1>
          <Badge
            variant="outline"
            className="bg-success/15 text-success border-success/30 text-xs font-semibold px-2.5 py-0.5 rounded-full"
          >
            Closed Won
          </Badge>
          <Badge
            variant="outline"
            className="bg-muted text-muted-foreground text-xs font-medium px-2 py-0.5 rounded-full border-border flex items-center gap-1"
          >
            <Lock className="size-3" />
            <span>Data Frozen / SOW Locked (BR-HND-01)</span>
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          Perusahaan:{" "}
          <span className="font-semibold text-foreground">
            {deal.client.companyName}
          </span>
          <span className="mx-2">•</span>
          Klien:{" "}
          <span className="font-semibold text-foreground">
            {deal.client.clientName}
          </span>
          <span className="mx-2">•</span>
          PIC Sales:{" "}
          <span className="font-semibold text-foreground">
            {deal.user?.name || "Tim Klienka"}
          </span>
        </p>
      </div>

      {/* Action Button: Kembali */}
      <div className="flex items-center gap-2 shrink-0">
        <Link href="/handoff">
          <Button
            size="sm"
            variant="outline"
            className="h-8 text-xs gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="size-3.5" />
            <span>Kembali</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
