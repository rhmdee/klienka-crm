"use client";

import { useState } from "react";
import { Sheet } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";
import { Loader2 } from "lucide-react";
import { ClientItem, LEAD_SOURCE_OPTIONS } from "./types";
import { getRoleHeaders } from "@/lib/api-client";

interface ClientFormDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientToEdit?: ClientItem | null;
  onSuccess: () => void;
}

interface ClientFormContentProps {
  clientToEdit?: ClientItem | null;
  onClose: () => void;
  onSuccess: () => void;
}

function ClientFormContent({
  clientToEdit,
  onClose,
  onSuccess,
}: ClientFormContentProps) {
  const [clientName, setClientName] = useState(clientToEdit?.clientName ?? "");
  const [companyName, setCompanyName] = useState(
    clientToEdit?.companyName ?? "",
  );
  const [contactEmail, setContactEmail] = useState(
    clientToEdit?.contactEmail ?? "",
  );
  const [contactPhone, setContactPhone] = useState(
    clientToEdit?.contactPhone ?? "",
  );
  const [leadSource, setLeadSource] = useState(
    clientToEdit?.leadSource ?? "",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const isEditMode = Boolean(clientToEdit);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!clientName.trim()) {
      newErrors.clientName = "Nama PIC / Klien wajib diisi.";
    }

    if (!companyName.trim()) {
      newErrors.companyName = "Nama perusahaan / institusi wajib diisi.";
    }

    if (!contactEmail.trim()) {
      newErrors.contactEmail = "Alamat email wajib diisi.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail.trim())) {
      newErrors.contactEmail =
        "Format email tidak valid (contoh: user@company.com).";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const url = isEditMode
        ? `/api/clients/${clientToEdit?.id}`
        : "/api/clients";
      const method = isEditMode ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...getRoleHeaders(),
        },
        body: JSON.stringify({
          clientName: clientName.trim(),
          companyName: companyName.trim(),
          contactEmail: contactEmail.trim(),
          contactPhone: contactPhone.trim() || null,
          leadSource: leadSource.trim() || null,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.message || "Gagal menyimpan data klien.");
        return;
      }

      toast.success(
        isEditMode
          ? "Data klien berhasil diperbarui."
          : "Klien baru berhasil didaftarkan.",
      );
      onClose();
      onSuccess();
    } catch (error) {
      console.error("Error submitting client form:", error);
      toast.error("Terjadi kesalahan koneksi saat menyimpan data klien.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col justify-between flex-1 gap-4 text-xs"
    >
      <div className="flex flex-col gap-4">
        {/* 1. Nama PIC / Klien */}
        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-foreground">
            Nama PIC / Klien
          </label>
          <Input
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="Contoh: Budi Santoso"
            disabled={isSubmitting}
            className={
              errors.clientName
                ? "border-destructive focus-visible:ring-destructive"
                : ""
            }
          />
          {errors.clientName && (
            <span className="text-[11px] text-destructive">
              {errors.clientName}
            </span>
          )}
        </div>

        {/* 2. Nama Perusahaan / Institusi */}
        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-foreground">
            Perusahaan / Institusi
          </label>
          <Input
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Contoh: PT Maju Bersama"
            disabled={isSubmitting}
            className={
              errors.companyName
                ? "border-destructive focus-visible:ring-destructive"
                : ""
            }
          />
          {errors.companyName && (
            <span className="text-[11px] text-destructive">
              {errors.companyName}
            </span>
          )}
        </div>

        {/* 3. Email Kontak */}
        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-foreground">
            Email Kontak
          </label>
          <Input
            type="email"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            placeholder="budi@perusahaan.com"
            disabled={isSubmitting}
            className={
              errors.contactEmail
                ? "border-destructive focus-visible:ring-destructive"
                : ""
            }
          />
          {errors.contactEmail && (
            <span className="text-[11px] text-destructive">
              {errors.contactEmail}
            </span>
          )}
        </div>

        {/* 4. Nomor Telepon / WhatsApp */}
        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-foreground">
            No. Telepon / WhatsApp (Opsional)
          </label>
          <Input
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
            placeholder="+62 812-3456-7890"
            disabled={isSubmitting}
          />
        </div>

        {/* 5. Sumber Prospek (Lead Source) */}
        <div className="flex flex-col gap-1.5">
          <label className="font-semibold text-foreground">
            Sumber Prospek (Lead Source)
          </label>
          <Input
            value={leadSource}
            onChange={(e) => setLeadSource(e.target.value)}
            placeholder="Pilih opsi di bawah atau ketik sumber kustom..."
            disabled={isSubmitting}
          />
          {/* Quick Suggestion Pills */}
          <div className="flex flex-wrap gap-1 mt-1">
            {LEAD_SOURCE_OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setLeadSource(opt)}
                className={`text-[10px] px-2 py-0.5 rounded-full border transition-colors cursor-pointer ${
                  leadSource === opt
                    ? "bg-primary text-primary-foreground border-primary font-medium"
                    : "bg-muted/50 hover:bg-muted text-muted-foreground border-border"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-2 pt-4 border-t border-border mt-auto">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isSubmitting}
          className="cursor-pointer"
        >
          Batal
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="gap-1.5 cursor-pointer shadow-2xs"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-3.5 animate-spin" />
              <span>Menyimpan...</span>
            </>
          ) : (
            <span>{isEditMode ? "Simpan Perubahan" : "Daftarkan Klien"}</span>
          )}
        </Button>
      </div>
    </form>
  );
}

export function ClientFormDrawer({
  open,
  onOpenChange,
  clientToEdit,
  onSuccess,
}: ClientFormDrawerProps) {
  const isEditMode = Boolean(clientToEdit);

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      title={isEditMode ? "Edit Profil Klien" : "Tambah Klien Baru"}
      description={
        isEditMode
          ? "Perbarui informasi kontak dan institusi klien di direktori CRM."
          : "Daftarkan entitas klien dan profil perusahaan baru ke dalam database master."
      }
    >
      {open && (
        <ClientFormContent
          key={clientToEdit?.id ?? "create-new-client"}
          clientToEdit={clientToEdit}
          onClose={() => onOpenChange(false)}
          onSuccess={onSuccess}
        />
      )}
    </Sheet>
  );
}
