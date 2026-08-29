"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Send,
  Building2,
  Layers,
  ShieldCheck,
  Loader2,
  RotateCcw,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/sonner";

interface SOWItemData {
  id: string;
  roleName: string;
  manDays: number;
  dailyRate: string | number;
  subtotal: string | number;
}

interface SOWData {
  id: string;
  version: number;
  status: "DRAFT" | "SENT" | "REVISING" | "APPROVED";
  totalCost: string | number;
  marginPercentage: number;
  tokenExpiresAt?: string | null;
  items: SOWItemData[];
  deal: {
    id: string;
    title: string;
    description?: string | null;
    techStack: string[];
    client: {
      id: string;
      clientName: string;
      companyName: string;
      contactEmail: string;
      contactPhone?: string | null;
    };
  };
}

function formatIDR(amount: number | string): string {
  const num = typeof amount === "string" ? parseInt(amount, 10) || 0 : amount;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(num);
}

export default function ClientPortalSOWPage() {
  const params = useParams();
  const token = typeof params?.token === "string" ? params.token : "";

  const [sow, setSow] = useState<SOWData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorStatus, setErrorStatus] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Modals state
  const [isApproveOpen, setIsApproveOpen] = useState<boolean>(false);
  const [isReviseOpen, setIsReviseOpen] = useState<boolean>(false);
  const [revisionNote, setRevisionNote] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Success state after action
  const [actionSuccess, setActionSuccess] = useState<
    "APPROVED" | "REVISED" | null
  >(null);

  useEffect(() => {
    let ignore = false;

    async function loadPortalSOW() {
      if (!token) return;
      try {
        setIsLoading(true);
        setErrorStatus(null);
        setErrorMessage("");

        const res = await fetch(`/api/portal/${token}`);
        const json = await res.json();

        if (!ignore) {
          if (res.ok && json.success && json.data) {
            setSow(json.data);
            if (json.data.status === "APPROVED") {
              setActionSuccess("APPROVED");
            }
          } else {
            setErrorStatus(res.status);
            setErrorMessage(
              json.message || "Tautan dokumen SOW tidak dapat diakses.",
            );
          }
        }
      } catch (err) {
        if (!ignore) {
          console.error("Error loading portal SOW:", err);
          setErrorStatus(500);
          setErrorMessage("Terjadi kesalahan saat memuat dokumen penawaran.");
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadPortalSOW();

    return () => {
      ignore = true;
    };
  }, [token]);

  // Handle Approve Action (BR-APP-02)
  const handleApprove = async () => {
    try {
      setIsSubmitting(true);
      const res = await fetch(`/api/portal/${token}/action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "APPROVE" }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        toast.error(json.message || "Gagal menyetujui dokumen SOW.");
        return;
      }

      setIsApproveOpen(false);
      setActionSuccess("APPROVED");
      toast.success("Dokumen SOW berhasil disetujui!");
    } catch (err) {
      console.error("Error approving SOW:", err);
      toast.error("Terjadi kesalahan jaringan saat memproses persetujuan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Revise Action (BR-APP-03)
  const handleRevise = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!revisionNote || revisionNote.trim().length < 15) {
      toast.warning(
        "Catatan revisi wajib diisi minimal 15 karakter (BR-APP-03).",
      );
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch(`/api/portal/${token}/action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "REVISE",
          revisionNote: revisionNote.trim(),
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        toast.error(json.message || "Gagal mengirim permintaan revisi.");
        return;
      }

      setIsReviseOpen(false);
      setActionSuccess("REVISED");
      toast.success("Permintaan revisi telah berhasil dikirimkan.");
    } catch (err) {
      console.error("Error submitting revision:", err);
      toast.error("Terjadi kesalahan jaringan saat mengirim catatan revisi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 1. Loading State Skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-3xl flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <Skeleton className="h-7 w-36 rounded-md" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
          <Card className="p-6 border-border bg-card flex flex-col gap-4 shadow-sm">
            <Skeleton className="h-6 w-64 rounded-md" />
            <Skeleton className="h-4 w-48 rounded-md" />
            <div className="mt-4 space-y-2">
              <Skeleton className="h-10 w-full rounded-md" />
              <Skeleton className="h-10 w-full rounded-md" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
            <div className="pt-4 border-t border-border flex justify-between">
              <Skeleton className="h-6 w-32 rounded-md" />
              <Skeleton className="h-6 w-40 rounded-md" />
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // 2. Error / Expired State (BR-APP-01)
  if (errorStatus || !sow) {
    const isExpired = errorStatus === 410;
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 sm:p-8">
        <Card className="w-full max-w-md p-6 sm:p-8 border-border bg-card text-center flex flex-col items-center gap-4 shadow-md">
          <div
            className={`size-12 rounded-full flex items-center justify-center ${
              isExpired
                ? "bg-warning/10 text-warning"
                : "bg-destructive/10 text-destructive"
            }`}
          >
            {isExpired ? (
              <Clock className="size-6" />
            ) : (
              <AlertTriangle className="size-6" />
            )}
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="text-lg font-bold text-foreground">
              {isExpired
                ? "Tautan Telah Kedaluwarsa"
                : "Dokumen Tidak Ditemukan"}
            </h1>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {errorMessage ||
                "Tautan penawaran ini sudah tidak berlaku atau telah digantikan dengan versi terbaru."}
            </p>
          </div>
          <div className="pt-2 text-[11px] text-muted-foreground border-t border-border w-full">
            Silakan hubungi tim konsultan software house kami untuk meminta
            tautan penawaran terbaru.
          </div>
        </Card>
      </div>
    );
  }

  // 3. Success Screen After Action
  if (actionSuccess) {
    const isApproved = actionSuccess === "APPROVED";
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 sm:p-8">
        <Card className="w-full max-w-lg p-6 sm:p-8 border-border bg-card text-center flex flex-col items-center gap-4 shadow-lg animate-in zoom-in-95 duration-200">
          <div
            className={`size-14 rounded-full flex items-center justify-center ${
              isApproved ? "bg-success/15 text-success" : "bg-info/15 text-info"
            }`}
          >
            {isApproved ? (
              <CheckCircle2 className="size-7" />
            ) : (
              <RotateCcw className="size-7" />
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <h1 className="text-xl font-bold text-foreground">
              {isApproved
                ? "Persetujuan SOW Berhasil Dikonfirmasi!"
                : "Permintaan Revisi Telah Diterima"}
            </h1>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {isApproved
                ? "Terima kasih atas persetujuan Anda. Status proyek telah diperbarui menjadi Closed Won dan tim Project Manager kami akan segera menginisiasi proses kick-off operasional."
                : "Catatan penyesuaian Anda telah tersimpan dan tim Business Development kami akan segera memperbarui kalkulasi serta mengirimkan proposal revisi."}
            </p>
          </div>

          <div className="w-full bg-muted/40 p-4 rounded-xl border border-border text-left flex flex-col gap-2 mt-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">Proyek:</span>
              <span className="font-semibold text-foreground">
                {sow.deal.title}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">Klien / Perusahaan:</span>
              <span className="font-semibold text-foreground">
                {sow.deal.client.companyName}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">
                Total Nilai Penawaran:
              </span>
              <span className="font-bold text-primary">
                {formatIDR(sow.totalCost)}
              </span>
            </div>
          </div>

          <div className="text-[11px] text-muted-foreground pt-3 border-t border-border w-full">
            Anda dapat menutup tab browser ini dengan aman.
          </div>
        </Card>
      </div>
    );
  }

  // 4. Active SOW Portal State
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col pb-28">
      {/* Top Navbar Brand */}
      <header className="w-full border-b border-border bg-card/60 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-7 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shadow-xs">
              K
            </div>
            <span className="font-bold text-sm tracking-tight text-foreground">
              Klienka Client Portal
            </span>
          </div>
          <Badge
            variant="outline"
            className="bg-primary/10 text-primary border-primary/30 text-xs font-semibold px-2.5 py-0.5 rounded-full"
          >
            SOW Versi {sow.version}
          </Badge>
        </div>
      </header>

      {/* Main Document Content */}
      <main className="max-w-4xl w-full mx-auto px-4 sm:px-6 pt-6 sm:pt-8 flex flex-col gap-6">
        {/* Document Header Card */}
        <Card className="p-5 sm:p-6 border-border bg-card flex flex-col gap-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <FileText className="size-5 text-primary" />
                <h1 className="text-lg sm:text-xl font-bold text-foreground">
                  {sow.deal.title}
                </h1>
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Building2 className="size-3.5" />
                <span>Penerima:</span>
                <span className="font-semibold text-foreground">
                  {sow.deal.client.companyName}
                </span>
                <span>({sow.deal.client.clientName})</span>
              </p>
            </div>

            <div className="flex flex-col sm:items-end">
              <span className="text-[11px] text-muted-foreground font-medium">
                Total Biaya Penawaran
              </span>
              <span className="text-xl sm:text-2xl font-bold text-primary">
                {formatIDR(sow.totalCost)}
              </span>
            </div>
          </div>

          {/* Project Scope Description */}
          {sow.deal.description && (
            <div className="flex flex-col gap-1 text-xs">
              <span className="text-muted-foreground font-medium">
                Deskripsi Ruang Lingkup Proyek:
              </span>
              <p className="text-foreground leading-relaxed bg-muted/30 p-3 rounded-lg border border-border">
                {sow.deal.description}
              </p>
            </div>
          )}

          {/* Tech Stack Requirements */}
          {sow.deal.techStack && sow.deal.techStack.length > 0 && (
            <div className="flex flex-col gap-1.5 text-xs pt-2">
              <span className="text-muted-foreground font-medium">
                Rencana Tech Stack & Arsitektur:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {sow.deal.techStack.map((tech) => (
                  <Badge
                    key={tech}
                    variant="secondary"
                    className="text-[11px] px-2.5 py-0.5 font-normal"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* SOW Breakdown Table Card */}
        <Card className="p-5 sm:p-6 border-border bg-card flex flex-col gap-4 shadow-xs">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <div className="size-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Layers className="size-4" />
            </div>
            <div>
              <h2 className="font-semibold text-sm text-foreground">
                Rincian Alokasi Peran Teknis & Man-Days
              </h2>
              <p className="text-[11px] text-muted-foreground">
                Spesifikasi pembagian beban kerja tim pengembang (Scope of Work)
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-muted-foreground font-medium">
                  <th className="py-3 px-3.5">Peran Teknis (Role)</th>
                  <th className="py-3 px-3.5 text-center">Alokasi Man-Days</th>
                  <th className="py-3 px-3.5 text-right">Tarif Harian</th>
                  <th className="py-3 px-3.5 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {sow.items.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/20">
                    <td className="py-3 px-3.5 font-medium text-foreground">
                      {item.roleName}
                    </td>
                    <td className="py-3 px-3.5 text-center">
                      <span className="bg-primary/10 text-primary font-semibold px-2.5 py-1 rounded-md">
                        {item.manDays} Man-Days
                      </span>
                    </td>
                    <td className="py-3 px-3.5 text-right text-muted-foreground">
                      {formatIDR(item.dailyRate)}
                    </td>
                    <td className="py-3 px-3.5 text-right font-medium text-foreground">
                      {formatIDR(item.subtotal)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-border bg-muted/30">
                  <td
                    colSpan={3}
                    className="py-3 px-3.5 text-right font-bold text-foreground"
                  >
                    Total Biaya Penawaran Resmi:
                  </td>
                  <td className="py-3 px-3.5 text-right font-bold text-primary text-base">
                    {formatIDR(sow.totalCost)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </Card>
      </main>

      {/* Floating Bottom Action Bar */}
      <div className="fixed bottom-0 inset-x-0 bg-card/90 backdrop-blur-md border-t border-border py-3 px-4 z-40 shadow-lg">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground text-center sm:text-left">
            <ShieldCheck className="size-4 text-success shrink-0" />
            <span>
              Dokumen ini resmi diterbitkan oleh Software House untuk{" "}
              <strong className="text-foreground">
                {sow.deal.client.companyName}
              </strong>
              .
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Secondary Action: Request Revision */}
            <Button
              size="default"
              variant="outline"
              onClick={() => setIsReviseOpen(true)}
              className="flex-1 sm:flex-none h-10 text-xs font-semibold gap-1.5 cursor-pointer"
            >
              <RotateCcw className="size-3.5" />
              <span>Minta Revisi (Request Revision)</span>
            </Button>

            {/* Primary Action: Approve SOW */}
            <Button
              size="default"
              variant="default"
              onClick={() => setIsApproveOpen(true)}
              className="flex-1 sm:flex-none h-10 text-xs font-semibold gap-1.5 cursor-pointer bg-success text-success-foreground hover:bg-success/90 shadow-xs"
            >
              <CheckCircle2 className="size-4" />
              <span>Setujui SOW (Approve)</span>
            </Button>
          </div>
        </div>
      </div>

      {/* MODAL 1: Popup Approval SOW (Wajib Sharp Corners / rounded-none sesuai BR-APP-02 & Pilar UI) */}
      <AlertDialog
        open={isApproveOpen}
        onOpenChange={setIsApproveOpen}
        title="Konfirmasi Persetujuan Dokumen SOW"
        description="Persetujuan ini mengikat secara resmi ruang lingkup teknis dan biaya penawaran proyek."
        className="rounded-none! border-2 border-foreground/30 shadow-2xl"
      >
        <div className="flex flex-col gap-4 text-xs">
          <div className="p-3 bg-muted/40 border border-border flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Proyek:</span>
              <span className="font-semibold text-foreground">
                {sow.deal.title}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">
                Total Nilai Disetujui:
              </span>
              <span className="font-bold text-primary">
                {formatIDR(sow.totalCost)}
              </span>
            </div>
          </div>

          <p className="text-muted-foreground leading-relaxed">
            Dengan mengonfirmasi persetujuan ini, status prospek bisnis akan
            segera berpindah ke <strong>Closed Won</strong> dan dokumen ini akan
            dikunci (*immutable lock*).
          </p>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsApproveOpen(false)}
              disabled={isSubmitting}
              className="h-8 text-xs cursor-pointer rounded-none!"
            >
              Batal
            </Button>
            <Button
              type="button"
              onClick={handleApprove}
              disabled={isSubmitting}
              className="h-8 text-xs font-semibold gap-1.5 cursor-pointer bg-success text-success-foreground hover:bg-success/90 rounded-none!"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Memproses...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="size-3.5" />
                  <span>Ya, Saya Setujui SOW</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </AlertDialog>

      {/* MODAL 2: Popup Request Revision (BR-APP-03 - Validasi min 15 karakter) */}
      <AlertDialog
        open={isReviseOpen}
        onOpenChange={setIsReviseOpen}
        title="Ajukan Permintaan Revisi SOW"
        description="Sampaikan catatan atau penyesuaian yang Anda perlukan pada alokasi teknis maupun estimasi biaya."
        className="rounded-xl border border-border"
      >
        <form onSubmit={handleRevise} className="flex flex-col gap-4 text-xs">
          <div className="flex flex-col gap-1.5">
            <label className="font-medium text-foreground flex items-center justify-between">
              <span>Catatan Revisi *</span>
              <span
                className={`text-[10px] ${
                  revisionNote.trim().length >= 15
                    ? "text-success font-medium"
                    : "text-muted-foreground"
                }`}
              >
                {revisionNote.trim().length} / 15 karakter minimal
              </span>
            </label>
            <textarea
              rows={4}
              value={revisionNote}
              onChange={(e) => setRevisionNote(e.target.value)}
              placeholder="Jelaskan secara detail bagian yang perlu disesuaikan (minimal 15 karakter)..."
              className="w-full text-xs p-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors resize-none"
            />
            {revisionNote.length > 0 && revisionNote.trim().length < 15 && (
              <span className="text-[10px] text-destructive">
                Catatan revisi terlalu singkat, mohon jelaskan bagian yang perlu
                disesuaikan (minimal 15 karakter).
              </span>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsReviseOpen(false)}
              disabled={isSubmitting}
              className="h-8 text-xs cursor-pointer"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || revisionNote.trim().length < 15}
              className="h-8 text-xs font-semibold gap-1.5 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Mengirimkan...</span>
                </>
              ) : (
                <>
                  <Send className="size-3.5" />
                  <span>Kirim Permintaan Revisi</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </AlertDialog>
    </div>
  );
}
