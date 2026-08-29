"use client";

import { useState } from "react";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";
import { Loader2, KeyRound } from "lucide-react";
import { GeneralParamItem } from "./types";
import { getRoleHeaders } from "@/lib/api-client";

interface ParamFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  paramToEdit?: GeneralParamItem | null;
  onSuccess: () => void;
}

interface ParamFormContentProps {
  paramToEdit?: GeneralParamItem | null;
  onClose: () => void;
  onSuccess: () => void;
}

function ParamFormContent({
  paramToEdit,
  onClose,
  onSuccess,
}: ParamFormContentProps) {
  const [paramKey, setParamKey] = useState(paramToEdit?.paramKey ?? "");
  const [paramValue, setParamValue] = useState(paramToEdit?.paramValue ?? "");
  const [description, setDescription] = useState(paramToEdit?.description ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const isEditMode = Boolean(paramToEdit);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    const formattedKey = paramKey.trim();
    if (!formattedKey) {
      newErrors.paramKey = "Kunci parameter (Key) wajib diisi.";
    } else if (!/^[A-Za-z0-9_]+$/.test(formattedKey)) {
      newErrors.paramKey =
        "Kunci parameter hanya boleh berisi huruf, angka, dan underscore (_).";
    }

    if (!paramValue.trim()) {
      newErrors.paramValue = "Nilai parameter (Value) wajib diisi.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleKeyChange = (val: string) => {
    // Otomatis ubah spasi jadi underscore dan ubah ke uppercase untuk memudahkan konvensi KEY
    const formatted = val.replace(/\s+/g, "_").toUpperCase();
    setParamKey(formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const url = isEditMode
        ? `/api/settings/general-params/${paramToEdit?.id}`
        : "/api/settings/general-params";
      const method = isEditMode ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...getRoleHeaders(),
        },
        body: JSON.stringify({
          paramKey: paramKey.trim(),
          paramValue: paramValue.trim(),
          description: description.trim() || null,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.message || "Gagal menyimpan parameter sistem.");
        return;
      }

      toast.success(
        isEditMode
          ? "Parameter sistem berhasil diperbarui."
          : "Parameter sistem baru berhasil ditambahkan.",
      );
      onClose();
      onSuccess();
    } catch (error) {
      console.error("Error submitting param form:", error);
      toast.error("Terjadi kesalahan koneksi jaringan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
      {/* Input Kunci Parameter (Key) */}
      <div className="flex flex-col gap-1.5">
        <label className="font-semibold text-foreground flex items-center gap-1.5">
          <KeyRound className="size-3.5 text-muted-foreground" />
          <span>Kunci Parameter (Key)</span>
        </label>
        <Input
          value={paramKey}
          onChange={(e) => handleKeyChange(e.target.value)}
          placeholder="Contoh: OPERATOR_NAME, MIN_MARGIN, RATE_FRONTEND"
          disabled={isSubmitting}
          className={`font-mono ${
            errors.paramKey
              ? "border-destructive focus-visible:ring-destructive"
              : ""
          }`}
        />
        {errors.paramKey ? (
          <span className="text-[11px] text-destructive">
            {errors.paramKey}
          </span>
        ) : (
          <span className="text-[10px] text-muted-foreground">
            Gunakan format UPPER_SNAKE_CASE (spasi otomatis terkonversi).
          </span>
        )}
      </div>

      {/* Input Nilai Parameter (Value) */}
      <div className="flex flex-col gap-1.5">
        <label className="font-semibold text-foreground">
          Nilai Parameter (Value)
        </label>
        <Input
          value={paramValue}
          onChange={(e) => setParamValue(e.target.value)}
          placeholder="Contoh: Budi Santoso, 500000, 20"
          disabled={isSubmitting}
          className={
            errors.paramValue
              ? "border-destructive focus-visible:ring-destructive"
              : ""
          }
        />
        {errors.paramValue && (
          <span className="text-[11px] text-destructive">
            {errors.paramValue}
          </span>
        )}
      </div>

      {/* Input Deskripsi */}
      <div className="flex flex-col gap-1.5">
        <label className="font-semibold text-foreground">
          Deskripsi (Opsional)
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Penjelasan fungsi atau tujuan parameter ini..."
          disabled={isSubmitting}
          rows={3}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent transition-colors resize-none"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-2 pt-3 border-t border-border mt-1">
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
            <span>{isEditMode ? "Simpan Perubahan" : "Buat Parameter"}</span>
          )}
        </Button>
      </div>
    </form>
  );
}

export function ParamFormDialog({
  open,
  onOpenChange,
  paramToEdit,
  onSuccess,
}: ParamFormDialogProps) {
  const isEditMode = Boolean(paramToEdit);

  return (
    <AlertDialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEditMode ? "Edit Parameter Sistem" : "Tambah Parameter Baru"}
      description={
        isEditMode
          ? "Perbarui nilai dan deskripsi parameter konfigurasi sistem."
          : "Tambahkan variabel konfigurasi baru untuk digunakan di seluruh modul CRM."
      }
    >
      <ParamFormContent
        key={paramToEdit?.id ?? "create-new-param"}
        paramToEdit={paramToEdit}
        onClose={() => onOpenChange(false)}
        onSuccess={onSuccess}
      />
    </AlertDialog>
  );
}
