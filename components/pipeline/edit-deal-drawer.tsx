"use client";

import { useState, type FormEvent } from "react";
import { Sheet } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DealItem } from "./types";
import { getRoleHeaders } from "@/lib/api-client";
import { Save, Loader2 } from "lucide-react";

interface EditDealDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deal: DealItem;
  onSuccess: (updatedDeal: DealItem) => void;
}

interface EditDealFormProps {
  deal: DealItem;
  onCancel: () => void;
  onSuccess: (updatedDeal: DealItem) => void;
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

function EditDealForm({ deal, onCancel, onSuccess }: EditDealFormProps) {
  const [title, setTitle] = useState(deal.title || "");
  const [description, setDescription] = useState(deal.description || "");
  const [estimatedBudgetInput, setEstimatedBudgetInput] = useState(
    formatNumberMask(deal.estimatedBudget || 0),
  );
  const [contactPhone, setContactPhone] = useState(
    deal.client.contactPhone || "",
  );
  const [techStackInput, setTechStackInput] = useState(
    (deal.techStack || []).join(", "),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    // Split teks tech stack berdasarkan tanda koma (,) dan bersihkan spasi
    const techStack = techStackInput
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    const estimatedBudget = parseNumberMask(estimatedBudgetInput);

    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        estimatedBudget,
        techStack,
        contactPhone: contactPhone.trim(),
      };

      const res = await fetch(`/api/leads/${deal.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...getRoleHeaders(),
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setErrorMsg(json.message || "Gagal memperbarui data prospek.");
        return;
      }

      onSuccess(json.data);
    } catch (err) {
      console.error("Update deal error:", err);
      setErrorMsg("Terjadi kesalahan jaringan saat menyimpan perubahan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
      {errorMsg && (
        <div className="p-3 text-xs rounded-md bg-destructive/10 text-destructive border border-destructive/20">
          {errorMsg}
        </div>
      )}

      {/* Field 1: Judul Prospek / Proyek (Top Label) */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-foreground">
          Judul Prospek / Proyek *
        </label>
        <Input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="h-9 text-xs"
          placeholder="Contoh: Pengembangan Aplikasi Mobile..."
        />
      </div>

      {/* Field 2: Estimasi Nilai Budget (Top Label - dengan masking titik) */}
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
          className="h-9 text-xs font-mono"
          placeholder="0"
        />
      </div>

      {/* Field 3: Nomor Telepon / WhatsApp (Top Label) */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-foreground">
          No. Telepon / WhatsApp Klien
        </label>
        <Input
          type="text"
          value={contactPhone}
          onChange={(e) => setContactPhone(e.target.value)}
          className="h-9 text-xs"
          placeholder="+62 812-xxxx-xxxx"
        />
      </div>

      {/* Field 4: Rencana Tech Stack (Top Label - Langsung di input dipisahkan koma) */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-foreground">
            Rencana Tech Stack
          </label>
          <span className="text-[11px] text-muted-foreground">
            Pisahkan dengan tanda koma ( , )
          </span>
        </div>
        <Input
          type="text"
          value={techStackInput}
          onChange={(e) => setTechStackInput(e.target.value)}
          placeholder="Contoh: Next.js, TypeScript, PostgreSQL, TailwindCSS"
          className="h-9 text-xs"
        />
        <span className="text-[11px] text-muted-foreground">
          Ketik nama teknologi dan pisahkan dengan koma (e.g. Next.js,
          PostgreSQL).
        </span>
      </div>

      {/* Field 5: Deskripsi Kebutuhan Proyek (Top Label) */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-foreground">
          Deskripsi Kebutuhan Proyek
        </label>
        <textarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full text-xs p-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors resize-none"
          placeholder="Ringkasan kebutuhan, tujuan MVP, atau catatan scope of work..."
        />
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
            <Save className="size-3.5" />
          )}
          <span>Simpan Perubahan</span>
        </Button>
      </div>
    </form>
  );
}

export function EditDealDrawer({
  open,
  onOpenChange,
  deal,
  onSuccess,
}: EditDealDrawerProps) {
  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      title="Edit Informasi Prospek"
      description="Perbarui informasi umum proyek, estimasi biaya, tech stack, dan kontak klien."
    >
      {open && (
        <EditDealForm
          deal={deal}
          onCancel={() => onOpenChange(false)}
          onSuccess={(updatedDeal) => {
            onSuccess(updatedDeal);
            onOpenChange(false);
          }}
        />
      )}
    </Sheet>
  );
}
