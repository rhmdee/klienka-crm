"use client";

import { Building2, Edit3, Code2, FileText, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DealItem } from "../types";

interface DealDetailProjectInfoProps {
  deal: DealItem;
  onOpenEditDrawer: () => void;
}

export function DealDetailProjectInfo({
  deal,
  onOpenEditDrawer,
}: DealDetailProjectInfoProps) {
  return (
    <Card className="p-4 border-border bg-card flex flex-col gap-3">
      <div className="flex items-center justify-between border-b border-border pb-2.5">
        <div className="flex items-center gap-2">
          <Building2 className="size-4 text-primary" />
          <h2 className="font-semibold text-sm text-foreground">
            Informasi Ringkasan & Ruang Lingkup Proyek
          </h2>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={onOpenEditDrawer}
          className="gap-1 text-xs h-7 px-2.5 cursor-pointer"
        >
          <Edit3 className="size-3" />
          <span>Edit Prospek</span>
        </Button>
      </div>

      <div className="flex flex-col gap-1.5 text-xs">
        <span className="text-muted-foreground font-medium">
          Deskripsi Kebutuhan:
        </span>
        <p className="text-foreground leading-relaxed bg-background/50 p-2.5 rounded-lg border border-border/60">
          {deal.description ||
            "Belum ada deskripsi lengkap mengenai kebutuhan proyek ini. Klik tombol 'Edit Prospek' untuk melengkapi scope of work."}
        </p>
      </div>

      {/* Rencana Tech Stack */}
      <div className="pt-2 border-t border-border/60 flex flex-col gap-1.5">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
          <Code2 className="size-3.5" />
          <span>Rencana Tech Stack & Arsitektur:</span>
        </div>
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          {deal.techStack && deal.techStack.length > 0 ? (
            deal.techStack.map((tech) => (
              <Badge
                key={tech}
                variant="secondary"
                className="text-xs px-2 py-0.5 font-normal"
              >
                {tech}
              </Badge>
            ))
          ) : (
            <span className="text-xs text-muted-foreground italic">
              Belum ditentukan
            </span>
          )}
        </div>
      </div>

      {/* Scope of Work / Estimasi SOW */}
      {deal.sows && deal.sows.length > 0 && (
        <div className="pt-2 border-t border-border/60 flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
              <FileText className="size-3.5" />
              <span>Dokumen Scope of Work (SOW):</span>
            </span>
            <Link
              href={`/sow?dealId=${deal.id}`}
              className="text-xs text-primary hover:underline flex items-center gap-1 font-medium"
            >
              <span>Lihat SOW</span>
              <ArrowRight className="size-3" />
            </Link>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-background border border-border text-xs">
            <div className="flex flex-col">
              <span className="font-semibold text-foreground">
                {deal.sows[0].title || `SOW Dokumen #${deal.sows[0].id.slice(0, 8)}`}
              </span>
              <span className="text-[11px] text-muted-foreground">
                Versi {deal.sows[0].version} • Status: {deal.sows[0].status}
              </span>
            </div>
            <Badge variant="outline" className="text-[10px]">
              {deal.sows[0].status}
            </Badge>
          </div>
        </div>
      )}
    </Card>
  );
}
