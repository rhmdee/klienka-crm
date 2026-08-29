"use client";

import { User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DealItem } from "../types";

interface DealDetailPicCardProps {
  deal: DealItem;
}

export function DealDetailPicCard({ deal }: DealDetailPicCardProps) {
  const initials = deal.user?.name
    ? deal.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "BD";

  return (
    <Card className="p-4 border-border bg-card flex flex-col gap-2.5">
      <div className="flex items-center gap-2 border-b border-border pb-2">
        <User className="size-4 text-primary" />
        <h2 className="font-semibold text-sm text-foreground">
          PIC & Tim Pengelola
        </h2>
      </div>
      <div className="flex items-center gap-3">
        <div className="size-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
          {initials}
        </div>
        <div className="flex flex-col min-w-0">
          <span className="font-semibold text-xs text-foreground truncate">
            {deal.user?.name || "Belum Ditugaskan"}
          </span>
          <span className="text-[11px] text-muted-foreground truncate">
            {deal.user?.email || "-"}
          </span>
          <Badge variant="outline" className="text-[10px] w-fit mt-1">
            {deal.user?.role?.replace("_", " ") || "Business Development"}
          </Badge>
        </div>
      </div>
    </Card>
  );
}
