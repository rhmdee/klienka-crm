"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Lock,
  Copy,
  Check,
  ExternalLink,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Loader2,
  Share2,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/sonner";
import { SOWCalculationResult, SOWGenerateResponse, formatIDR } from "./types";

interface SOWEstimatorSummaryProps {
  calculation: SOWCalculationResult;
  marginPercentage: number;
  onMarginChange: (value: number) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  generatedSOW: SOWGenerateResponse | null;
  dealId?: string;
  selectedDealTitle?: string;
  selectedClientName?: string;
  disabled?: boolean;
}

export function SOWEstimatorSummary({
  calculation,
  marginPercentage,
  onMarginChange,
  onGenerate,
  isGenerating,
  generatedSOW,
  dealId,
  selectedDealTitle,
  selectedClientName,
  disabled = false,
}: SOWEstimatorSummaryProps) {
  const [copied, setCopied] = useState(false);
  const [isDismissed, setIsDismissed] = useState<string | null>(null);

  const isDialogOpen = Boolean(
    generatedSOW && isDismissed !== (generatedSOW.magicLinkToken || generatedSOW.id)
  );

  // Generate Magic Link full URL
  const magicLinkUrl = generatedSOW
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/portal/sow/${generatedSOW.magicLinkToken}`
    : "";

  const handleCopyLink = async () => {
    if (!magicLinkUrl) return;
    try {
      await navigator.clipboard.writeText(magicLinkUrl);
      setCopied(true);
      toast.success("Magic link berhasil disalin ke clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Gagal menyalin link ke clipboard.");
    }
  };

  const handleShare = async () => {
    if (!magicLinkUrl) return;
    const shareText = `Halo, berikut adalah proposal penawaran Scope of Work (SOW) untuk proyek ${selectedDealTitle || "Anda"}: ${magicLinkUrl}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Proposal SOW - ${selectedDealTitle || "Klienka"}`,
          text: shareText,
          url: magicLinkUrl,
        });
        return;
      } catch {
        // Fallback to WhatsApp
      }
    }

    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");
  };

  const isMarginWarning = marginPercentage < 20;

  return (
    <div className="flex flex-col gap-4">
      <Card className="p-4 sm:p-5 border-border bg-card flex flex-col gap-4 shadow-sm">
        {/* Header */}
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <DollarSign className="size-4" />
          </div>
          <div>
            <h2 className="font-semibold text-sm text-foreground">
              Ringkasan Biaya & Kalkulasi Margin
            </h2>
            <p className="text-xs text-muted-foreground">
              Kalkulasi otomatis biaya pokok dan batas margin profit
            </p>
          </div>
        </div>

        {/* Selected Deal Context */}
        {selectedDealTitle && (
          <div className="p-2.5 rounded-lg bg-muted/40 border border-border/80 text-xs flex flex-col gap-0.5">
            <span className="text-[11px] text-muted-foreground">Target Prospek:</span>
            <span className="font-semibold text-foreground truncate">{selectedDealTitle}</span>
            {selectedClientName && (
              <span className="text-[11px] text-muted-foreground">{selectedClientName}</span>
            )}
          </div>
        )}

        {/* Cost Breakdown */}
        <div className="flex flex-col gap-2.5 text-xs">
          {/* Base Cost (COGS) */}
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Total Base Cost (COGS):</span>
            <span className="font-semibold text-foreground">
              {formatIDR(calculation.baseCost)}
            </span>
          </div>

          {/* Margin Control */}
          <div className="flex flex-col gap-1.5 pt-2 border-t border-border/60">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-1">
                <TrendingUp className="size-3 text-primary" />
                <span>Margin Profit Minimum:</span>
              </span>
              <div className="flex items-center gap-1.5">
                <div className="relative w-20">
                  <Input
                    type="number"
                    min={20}
                    max={100}
                    disabled={disabled}
                    value={marginPercentage}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      onMarginChange(val);
                    }}
                    className={`h-7 text-xs pr-6 font-semibold text-right ${
                      isMarginWarning ? "border-destructive focus-visible:ring-destructive" : ""
                    }`}
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">
                    %
                  </span>
                </div>
              </div>
            </div>

            {/* Minimum 20% rule notification / lock badge */}
            <div className="flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Lock className="size-3 text-secondary" />
                <span>Aturan Profit Lock (BR-SOW-02): Min. 20%</span>
              </div>
              {isMarginWarning ? (
                <span className="text-destructive flex items-center gap-0.5 font-medium">
                  <AlertTriangle className="size-3" />
                  <span>Di bawah 20%</span>
                </span>
              ) : (
                <Badge variant="outline" className="text-[10px] bg-success/10 text-success border-success/30 px-1.5 py-0">
                  Memenuhi Syarat
                </Badge>
              )}
            </div>
          </div>

          {/* Margin Profit Amount */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-muted-foreground">Nilai Margin Keuntungan:</span>
            <span className="font-semibold text-primary">
              +{formatIDR(calculation.marginAmount)}
            </span>
          </div>

          {/* Final Total Offer */}
          <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 flex flex-col gap-1 mt-1">
            <span className="text-[11px] font-medium text-muted-foreground">
              Total Nilai Penawaran (Final SOW)
            </span>
            <div className="text-xl font-bold text-primary">
              {formatIDR(calculation.totalCost)}
            </div>
          </div>
        </div>

        {/* Generate Action Button */}
        <Button
          type="button"
          onClick={onGenerate}
          disabled={disabled || isGenerating || calculation.baseCost <= 0 || isMarginWarning}
          className="w-full h-9 gap-1.5 text-xs font-semibold cursor-pointer shadow-sm"
        >
          {isGenerating ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <span>Menyimpan & Membuat Magic Link...</span>
            </>
          ) : (
            <>
              <Sparkles className="size-4" />
              <span>Generate Proposal / Magic Link</span>
            </>
          )}
        </Button>

        {/* Tombol Buka Hasil Jika Sudah Tergenerate */}
        {generatedSOW && !isDialogOpen && (
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsDismissed(null)}
            className="w-full h-8 text-xs gap-1.5 text-success border-success/30 hover:bg-success/10 cursor-pointer"
          >
            <CheckCircle2 className="size-3.5 text-success" />
            <span>Lihat Magic Link Yang Dibuat</span>
          </Button>
        )}
      </Card>

      {/* Alert-Dialog Modal: Hasil Generate Magic Link di Tengah Layar (Focal Point) */}
      <AlertDialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsDismissed(generatedSOW?.magicLinkToken || generatedSOW?.id || "dismissed");
          }
        }}
        title="SOW Proposal Berhasil Dibuat!"
        description="Dokumen SOW telah disimpan dan status deal dimutasi ke tahap Negosiasi. Bagikan Magic Link berikut kepada klien untuk ditinjau."
      >
        <div className="flex flex-col gap-4 text-xs">
          {/* Header Banner Inside Modal */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-success/10 border border-success/20">
            <div className="flex items-center gap-2">
              <div className="size-7 rounded-full bg-success text-success-foreground flex items-center justify-center">
                <Check className="size-4" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-foreground">
                  {selectedDealTitle || "Dokumen Penawaran SOW"}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Masa aktif 7 hari • Status: SENT
                </span>
              </div>
            </div>
            {generatedSOW && (
              <Badge variant="outline" className="text-xs bg-background">
                Versi {generatedSOW.version}
              </Badge>
            )}
          </div>

          {/* Magic Link URL Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Tautan Magic Link Klien:
            </label>
            <div className="flex items-center gap-2 bg-background p-2.5 rounded-lg border border-border">
              <input
                type="text"
                readOnly
                value={magicLinkUrl}
                className="flex-1 text-xs bg-transparent border-0 outline-none text-foreground select-all font-mono truncate"
              />
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleCopyLink}
                className="h-7 px-2.5 text-xs gap-1 cursor-pointer shrink-0"
              >
                {copied ? <Check className="size-3 text-success" /> : <Copy className="size-3" />}
                <span>{copied ? "Tersalin" : "Salin Link"}</span>
              </Button>
            </div>
          </div>

          {/* Action Buttons: Share & Portal */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              onClick={handleShare}
              className="h-9 text-xs gap-1.5 cursor-pointer"
            >
              <Share2 className="size-3.5" />
              <span>Bagikan (WhatsApp)</span>
            </Button>
            <a
              href={magicLinkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full"
            >
              <Button
                type="button"
                variant="secondary"
                className="w-full h-9 text-xs gap-1.5 cursor-pointer"
              >
                <ExternalLink className="size-3.5" />
                <span>Buka Portal Klien</span>
              </Button>
            </a>
          </div>

          {/* Dialog Footer Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-border mt-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() =>
                setIsDismissed(
                  generatedSOW?.magicLinkToken || generatedSOW?.id || "dismissed",
                )
              }
              className="text-xs text-muted-foreground hover:text-foreground cursor-pointer"
            >
              Tutup
            </Button>

            {dealId && (
              <Link href={`/pipeline/${dealId}`}>
                <Button size="sm" className="text-xs gap-1.5 cursor-pointer">
                  <ArrowLeft className="size-3.5" />
                  <span>Kembali ke Detail Prospek</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </AlertDialog>
    </div>
  );
}
