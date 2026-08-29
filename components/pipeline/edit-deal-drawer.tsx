"use client";

import { useState, type FormEvent } from "react";
import { Sheet } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { DealItem } from "./types";
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

function EditDealForm({ deal, onCancel, onSuccess }: EditDealFormProps) {
  const [title, setTitle] = useState(deal.title || "");
  const [description, setDescription] = useState(deal.description || "");
  const [estimatedBudget, setEstimatedBudget] = useState<number | string>(
    deal.estimatedBudget || 0,
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

    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        estimatedBudget: Number(estimatedBudget) || 0,
        techStack,
        contactPhone: contactPhone.trim(),
      };

      const res = await fetch(`/api/leads/${deal.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setErrorMsg(json.message || "Gagal menyimpan perubahan prospek.");
        return;
      }

      onSuccess(json.data);
    } catch (err) {
      console.error("Error updating deal:", err);
      setErrorMsg("Terjadi kesalahan jaringan saat menghubungi server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {errorMsg && (
        <div className="p-2.5 rounded-lg bg-on-destructive text-destructive text-xs border border-border-destructive">
          {errorMsg}
        </div>
      )}

      {/* Field 1: Judul Prospek (Top Label) */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-foreground">
          Judul Prospek / Proyek
        </label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex h-9 w-full rounded-md border border-border bg-background px-3 py-1 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors"
          placeholder="Contoh: Pengembangan Aplikasi Mobile..."
        />
      </div>

      {/* Field 2: Estimasi Nilai Budget (Top Label) */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-foreground">
          Estimasi Nilai Budget (IDR)
        </label>
        <input
          type="number"
          min={0}
          value={estimatedBudget}
          onChange={(e) => setEstimatedBudget(e.target.value)}
          className="flex h-9 w-full rounded-md border border-border bg-background px-3 py-1 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors"
          placeholder="0"
        />
      </div>

      {/* Field 3: Nomor Telepon / WhatsApp (Top Label) */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-foreground">
          No. Telepon / WhatsApp Klien
        </label>
        <input
          type="text"
          value={contactPhone}
          onChange={(e) => setContactPhone(e.target.value)}
          className="flex h-9 w-full rounded-md border border-border bg-background px-3 py-1 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors"
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
        <input
          type="text"
          value={techStackInput}
          onChange={(e) => setTechStackInput(e.target.value)}
          className="flex h-9 w-full rounded-md border border-border bg-background px-3 py-1 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors"
          placeholder="e.g. Next.js, Supabase, TailwindCSS, TypeScript"
        />
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
          className="w-full text-xs p-2.5 rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors resize-none"
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
