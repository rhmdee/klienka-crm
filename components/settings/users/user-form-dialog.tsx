"use client";

import { useState } from "react";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";
import { Loader2, ShieldCheck } from "lucide-react";
import { ROLES, RoleType, UserItem } from "./types";
import { getRoleHeaders } from "@/lib/api-client";

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userToEdit?: UserItem | null;
  onSuccess: () => void;
}

interface UserFormContentProps {
  userToEdit?: UserItem | null;
  onClose: () => void;
  onSuccess: () => void;
}

function UserFormContent({
  userToEdit,
  onClose,
  onSuccess,
}: UserFormContentProps) {
  const [name, setName] = useState(userToEdit?.name ?? "");
  const [email, setEmail] = useState(userToEdit?.email ?? "");
  const [role, setRole] = useState<RoleType>(
    userToEdit?.role ?? "BUSINESS_DEVELOPMENT",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const isEditMode = Boolean(userToEdit);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!name.trim()) {
      newErrors.name = "Nama lengkap wajib diisi.";
    } else if (name.trim().length < 2) {
      newErrors.name = "Nama lengkap minimal 2 karakter.";
    }

    if (!email.trim()) {
      newErrors.email = "Email wajib diisi.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Format email tidak valid.";
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
        ? `/api/settings/users/${userToEdit?.id}`
        : "/api/settings/users";
      const method = isEditMode ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...getRoleHeaders(),
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          role,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.message || "Gagal menyimpan data pengguna.");
        return;
      }

      toast.success(
        isEditMode
          ? "Data pengguna berhasil diperbarui."
          : "Pengguna baru berhasil ditambahkan.",
      );
      onClose();
      onSuccess();
    } catch (error) {
      console.error("Error submitting user form:", error);
      toast.error("Terjadi kesalahan koneksi jaringan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
      {/* Input Nama Lengkap */}
      <div className="flex flex-col gap-1.5">
        <label className="font-semibold text-foreground flex items-center gap-1.5">
          <span>Nama Lengkap</span>
        </label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Contoh: Rian Pratama"
          disabled={isSubmitting}
          className={
            errors.name
              ? "border-destructive focus-visible:ring-destructive"
              : ""
          }
        />
        {errors.name && (
          <span className="text-[11px] text-destructive">{errors.name}</span>
        )}
      </div>

      {/* Input Email */}
      <div className="flex flex-col gap-1.5">
        <label className="font-semibold text-foreground">Alamat Email</label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="nama@klienka.com"
          disabled={isSubmitting}
          className={
            errors.email
              ? "border-destructive focus-visible:ring-destructive"
              : ""
          }
        />
        {errors.email && (
          <span className="text-[11px] text-destructive">{errors.email}</span>
        )}
      </div>

      {/* Input Peran (Role) */}
      <div className="flex flex-col gap-2">
        <label className="font-semibold text-foreground flex items-center gap-1.5">
          <ShieldCheck className="size-3.5 text-muted-foreground" />
          <span>Peran & Hak Akses (Role)</span>
        </label>

        <div className="grid grid-cols-1 gap-2">
          {ROLES.map((r) => {
            const isSelected = role === r.value;
            return (
              <div
                key={r.value}
                onClick={() => !isSubmitting && setRole(r.value)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-2.5 ${
                  isSelected
                    ? "border-primary bg-primary/5 shadow-2xs"
                    : "border-border hover:bg-muted/40"
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  checked={isSelected}
                  onChange={() => setRole(r.value)}
                  className="mt-0.5 accent-primary cursor-pointer"
                  disabled={isSubmitting}
                />
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">
                      {r.label}
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${r.badgeClass}`}
                    >
                      {r.value}
                    </span>
                  </div>
                  <span className="text-[11px] text-muted-foreground leading-tight">
                    {r.description}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-2 pt-3 border-t border-border mt-2">
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
            <span>{isEditMode ? "Simpan Perubahan" : "Buat Pengguna"}</span>
          )}
        </Button>
      </div>
    </form>
  );
}

export function UserFormDialog({
  open,
  onOpenChange,
  userToEdit,
  onSuccess,
}: UserFormDialogProps) {
  const isEditMode = Boolean(userToEdit);

  return (
    <AlertDialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEditMode ? "Edit Data Pengguna" : "Tambah Pengguna Baru"}
      description={
        isEditMode
          ? "Perbarui informasi profil dan penugasan peran hak akses."
          : "Tambahkan anggota tim baru dan tetapkan peran hak akses yang sesuai."
      }
    >
      <UserFormContent
        key={userToEdit?.id ?? "create-new-user"}
        userToEdit={userToEdit}
        onClose={() => onOpenChange(false)}
        onSuccess={onSuccess}
      />
    </AlertDialog>
  );
}
