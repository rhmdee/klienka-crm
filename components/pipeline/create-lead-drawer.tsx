"use client";

import { useState, type FormEvent } from "react";
import { Sheet } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";
import { Plus, Loader2 } from "lucide-react";
import { DealItem } from "./types";
import { getRoleHeaders } from "@/lib/api-client";

interface CreateLeadDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (newDeal: DealItem) => void;
}

interface CreateLeadFormProps {
  onCancel: () => void;
  onSuccess: (newDeal: DealItem) => void;
}

function formatNumberMask(value: string | number): string {
  const clean = String(value).replace(/\D/g, "");
  if (!clean) return "";
  return new Intl.NumberFormat("id-ID").format(parseInt(clean, 10));
}

function parseNumberMask(value: string): number {
  const clean = value.replace(/\D/g, "");
  return clean ? parseInt(clean, 10) : 0;
}

function CreateLeadForm({ onCancel, onSuccess }: CreateLeadFormProps) {
  const [clientName, setClientName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [estimatedBudgetInput, setEstimatedBudgetInput] = useState("");
  const [techStackInput, setTechStackInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!clientName.trim() || clientName.trim().length < 3) {
      toast.error("Nama klien wajib diisi minimal 3 karakter.");
      return;
    }

    if (!companyName.trim() || companyName.trim().length < 2) {
      toast.error("Nama perusahaan wajib diisi minimal 2 karakter.");
      return;
    }

    if (!contactEmail.trim() || !contactEmail.includes("@")) {
      toast.error("Format email kontak tidak valid.");
      return;
    }

    setIsSubmitting(true);

    const techStack = techStackInput
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    const estimatedBudget = parseNumberMask(estimatedBudgetInput);

    try {
      const payload = {
        clientName: clientName.trim(),
        companyName: companyName.trim(),
        contactEmail: contactEmail.trim(),
        estimatedBudget,
        techStack,
      };

      const res = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getRoleHeaders(),
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        toast.error(json.message || "Gagal menambahkan lead baru.");
        return;
      }

      toast.success(
        `Lead baru untuk "${companyName}" berhasil dibuat dan ditempatkan pada tahap Inquiry (BR-PIP-01).`,
      );
      onSuccess(json.data);
    } catch (err) {
      console.error("Error creating lead:", err);
      toast.error("Terjadi kesalahan jaringan saat menambahkan lead.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
      {/* Field 1: Nama Klien */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-foreground">
          Nama Kontak Klien *
        </label>
        <Input
          required
          type="text"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          placeholder="e.g. John Doe"
          className="h-9 text-xs"
        />
      </div>

      {/* Field 2: Nama Perusahaan */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-foreground">
          Nama Perusahaan / Organisasi *
        </label>
        <Input
          required
          type="text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="e.g. PT Maju Bersama"
          className="h-9 text-xs"
        />
      </div>

      {/* Field 3: Email Kontak */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-foreground">
          Email Kontak *
        </label>
        <Input
          required
          type="email"
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
          placeholder="e.g. john@perusahaan.com"
          className="h-9 text-xs"
        />
      </div>

      {/* Field 4: Estimasi Budget dengan Masking Titik (e.g. 100.000.000) */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-foreground">
          Estimasi Nilai Budget (IDR)
        </label>
        <Input
          type="text"
          inputMode="numeric"
          value={estimatedBudgetInput}
          onChange={(e) => {
            const masked = formatNumberMask(e.target.value);
            setEstimatedBudgetInput(masked);
          }}
          placeholder="e.g. 50.000.000"
          className="h-9 text-xs font-mono"
        />
        <span className="text-[11px] text-muted-foreground">
          Wajib diisi (&gt;0) sebelum berpindah ke Discovery Call (BR-PIP-02).
        </span>
      </div>

      {/* Field 5: Kebutuhan Tech Stack */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-foreground">
          Kebutuhan Tech Stack (Pisahkan dengan koma)
        </label>
        <Input
          type="text"
          value={techStackInput}
          onChange={(e) => setTechStackInput(e.target.value)}
          placeholder="e.g. Next.js, PostgreSQL, TailwindCSS"
          className="h-9 text-xs"
        />
        <span className="text-[11px] text-muted-foreground">
          Minimal satu stack wajib terisi sebelum ke Discovery Call (BR-PIP-02).
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-2 pt-4 border-t border-border mt-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onCancel}
          disabled={isSubmitting}
          className="cursor-pointer"
        >
          Batal
        </Button>
        <Button
          type="submit"
          size="sm"
          disabled={isSubmitting}
          className="gap-1.5 cursor-pointer"
        >
          {isSubmitting ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <Plus className="size-3.5" />
          )}
          <span>Tambah Lead</span>
        </Button>
      </div>
    </form>
  );
}

export function CreateLeadDrawer({
  open,
  onOpenChange,
  onSuccess,
}: CreateLeadDrawerProps) {
  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      title="Tambah Lead Baru"
      description="Formulir profiling prospek baru untuk dimasukkan ke dalam Pipeline Kanban (Tahap Inquiry)."
    >
      {open && (
        <CreateLeadForm
          onCancel={() => onOpenChange(false)}
          onSuccess={(newDeal) => {
            onSuccess(newDeal);
            onOpenChange(false);
          }}
        />
      )}
    </Sheet>
  );
}
