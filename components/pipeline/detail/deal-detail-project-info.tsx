"use client";

import { useState } from "react";
import {
  Building2,
  Edit3,
  Code2,
  FileText,
  ArrowRight,
  FileSpreadsheet,
  Plus,
  Copy,
  Check,
} from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { DealItem } from "../types";

interface DealDetailProjectInfoProps {
  deal: DealItem;
  onOpenEditDrawer: () => void;
}

export function DealDetailProjectInfo({
  deal,
  onOpenEditDrawer,
}: DealDetailProjectInfoProps) {
  const [copied, setCopied] = useState(false);
  const sowItem = deal.sows && deal.sows.length > 0 ? deal.sows[0] : null;

  const handleCopyMagicLink = async () => {
    if (!sowItem?.magicLinkToken) return;
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const magicLinkUrl = `${origin}/portal/sow/${sowItem.magicLinkToken}`;

    try {
      await navigator.clipboard.writeText(magicLinkUrl);
      setCopied(true);
      toast.success("Magic link proposal berhasil disalin ke clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Gagal menyalin Magic Link.");
    }
  };

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

      {/* Scope of Work / Estimasi SOW (User Flow 2.2) */}
      <div className="pt-2 border-t border-border/60 flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
            <FileText className="size-3.5" />
            <span>Dokumen Scope of Work (SOW):</span>
          </span>
          {sowItem && (
            <Link
              href={`/pipeline/${deal.id}/sow`}
              className="text-xs text-primary hover:underline flex items-center gap-1 font-medium"
            >
              <span>Buka Estimator</span>
              <ArrowRight className="size-3" />
            </Link>
          )}
        </div>

        {sowItem ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg bg-background border border-border gap-2 text-xs">
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">
                  {sowItem.title || `Dokumen SOW #${sowItem.id.slice(0, 8)}`}
                </span>
                <Badge variant="outline" className="text-[10px]">
                  {sowItem.status}
                </Badge>
              </div>
              <span className="text-[11px] text-muted-foreground">
                Versi {sowItem.version} • Margin: {sowItem.marginPercentage || 20}%
              </span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
              {sowItem.magicLinkToken && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopyMagicLink}
                  className="h-7 px-2.5 text-xs gap-1.5 cursor-pointer text-foreground"
                  title="Salin Magic Link Proposal untuk Klien"
                >
                  {copied ? (
                    <Check className="size-3 text-success" />
                  ) : (
                    <Copy className="size-3 text-primary" />
                  )}
                  <span>{copied ? "Tersalin" : "Salin Magic Link"}</span>
                </Button>
              )}

              <Link href={`/pipeline/${deal.id}/sow`}>
                <Button size="sm" variant="ghost" className="h-7 px-2 text-xs gap-1 cursor-pointer">
                  <span>Lihat / Edit</span>
                  <ArrowRight className="size-3" />
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg bg-muted/20 border border-dashed border-border text-xs">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="size-4 text-muted-foreground shrink-0" />
              <span className="text-muted-foreground">
                Belum ada dokumen estimasi SOW untuk prospek ini.
              </span>
            </div>
            <Link href={`/pipeline/${deal.id}/sow`}>
              <Button size="sm" className="h-7 px-2.5 text-xs gap-1.5 cursor-pointer shrink-0">
                <Plus className="size-3" />
                <span>Buat Estimasi SOW</span>
              </Button>
            </Link>
          </div>
        )}
      </div>
    </Card>
  );
}
