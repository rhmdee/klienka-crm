"use client";

import { useState } from "react";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";
import { createClient } from "@/lib/supabase/client";
import { KeyRound, Loader2, Lock } from "lucide-react";

interface ChangePasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function ChangePasswordContent({ onClose }: { onClose: () => void }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!newPassword) {
      setError("Kata sandi baru wajib diisi.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Kata sandi baru minimal 6 karakter.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        throw updateError;
      }

      toast.success("Kata sandi Anda berhasil diperbarui!");
      onClose();
    } catch (err) {
      console.error("Error updating password:", err);
      toast.error(
        err instanceof Error
          ? err.message
          : "Gagal memperbarui kata sandi akun.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
          <KeyRound className="size-5" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground text-sm">
            Ubah Kata Sandi Akun
          </h3>
          <p className="text-xs text-muted-foreground">
            Perbarui kata sandi Anda untuk mengamankan akses ke CRM.
          </p>
        </div>
      </div>

      <div className="space-y-3 pt-1">
        <div className="space-y-1">
          <label className="text-xs font-medium text-foreground">
            Kata Sandi Baru
          </label>
          <div className="relative">
            <Input
              type="password"
              placeholder="Minimal 6 karakter"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={isSubmitting}
              className="pl-9 text-xs"
            />
            <Lock className="size-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-foreground">
            Konfirmasi Kata Sandi Baru
          </label>
          <div className="relative">
            <Input
              type="password"
              placeholder="Ulangi kata sandi baru"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isSubmitting}
              className="pl-9 text-xs"
            />
            <Lock className="size-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>

      <div className="flex items-center justify-end gap-2 pt-2 border-t border-border mt-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onClose}
          disabled={isSubmitting}
          className="cursor-pointer text-xs h-8"
        >
          Batal
        </Button>
        <Button
          type="submit"
          size="sm"
          disabled={isSubmitting}
          className="cursor-pointer text-xs h-8"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-1.5 size-3.5 animate-spin" />
              Menyimpan...
            </>
          ) : (
            "Simpan Kata Sandi"
          )}
        </Button>
      </div>
    </form>
  );
}

export function ChangePasswordDialog({
  open,
  onOpenChange,
}: ChangePasswordDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <ChangePasswordContent onClose={() => onOpenChange(false)} />
    </AlertDialog>
  );
}
