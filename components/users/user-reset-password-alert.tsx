"use client";

import { useState } from "react";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { KeyRound, Loader2 } from "lucide-react";
import { UserItem } from "./types";
import { getRoleHeaders } from "@/lib/api-client";

interface UserResetPasswordAlertProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserItem | null;
}

interface UserResetPasswordContentProps {
  user: UserItem;
  onClose: () => void;
}

function UserResetPasswordContent({
  user,
  onClose,
}: UserResetPasswordContentProps) {
  const [isSending, setIsSending] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    try {
      const res = await fetch(`/api/users/${user.id}/reset-password`, {
        method: "POST",
        headers: {
          ...getRoleHeaders(),
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.message || "Gagal mengirim email reset password.");
        return;
      }

      toast.success(
        `Email instruksi reset password berhasil dikirim ke ${user.email}.`,
      );
      onClose();
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error("Terjadi kesalahan saat memproses reset password.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
          <KeyRound className="size-5" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground text-sm">
            Kirim Link Reset Password
          </h3>
          <p className="text-xs text-muted-foreground">
            Instruksi pemulihan kata sandi akan dikirim langsung ke pengguna.
          </p>
        </div>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed">
        Apakah Anda yakin ingin mengirimkan email instruksi pemulihan kata sandi ke{" "}
        <strong className="text-foreground">{user.email}</strong> (
        <span className="text-foreground font-medium">{user.name}</span>)?
      </p>

      <div className="flex items-center justify-end gap-2 pt-2 border-t border-border mt-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onClose}
          disabled={isSending}
          className="cursor-pointer text-xs h-8"
        >
          Batal
        </Button>
        <Button
          type="button"
          size="sm"
          onClick={handleResetPassword}
          disabled={isSending}
          className="cursor-pointer text-xs h-8"
        >
          {isSending ? (
            <>
              <Loader2 className="mr-1.5 size-3.5 animate-spin" />
              Mengirim...
            </>
          ) : (
            "Kirim Email Reset"
          )}
        </Button>
      </div>
    </div>
  );
}

export function UserResetPasswordAlert({
  open,
  onOpenChange,
  user,
}: UserResetPasswordAlertProps) {
  if (!user) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <UserResetPasswordContent
        user={user}
        onClose={() => onOpenChange(false)}
      />
    </AlertDialog>
  );
}
