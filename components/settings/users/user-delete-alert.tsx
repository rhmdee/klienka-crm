"use client";

import { useState } from "react";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";
import { UserItem } from "./types";

interface UserDeleteAlertProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userToDelete: UserItem | null;
  onSuccess: () => void;
}

interface UserDeleteContentProps {
  userToDelete: UserItem;
  onClose: () => void;
  onSuccess: () => void;
}

function UserDeleteContent({
  userToDelete,
  onClose,
  onSuccess,
}: UserDeleteContentProps) {
  const [confirmInput, setConfirmInput] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const targetConfirmText = userToDelete.name;
  const isMatch = confirmInput.trim() === targetConfirmText.trim();

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isMatch || isDeleting) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/settings/users/${userToDelete.id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.message || "Gagal menghapus pengguna.");
        return;
      }

      toast.success("Pengguna berhasil dihapus.");
      onClose();
      onSuccess();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Terjadi kesalahan saat menghapus pengguna.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <form onSubmit={handleDelete} className="flex flex-col gap-4 text-xs">
      {/* Warning Box */}
      <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 flex items-start gap-3">
        <AlertTriangle className="size-5 text-destructive shrink-0 mt-0.5" />
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-foreground text-sm">
            Tindakan ini tidak dapat dibatalkan
          </span>
          <p className="text-muted-foreground leading-relaxed">
            Menghapus akun pengguna{" "}
            <strong className="text-foreground font-semibold">
              {userToDelete.name}
            </strong>{" "}
            ({userToDelete.email}) akan mencabut seluruh akses dan menghapus data secara permanen.
          </p>
        </div>
      </div>

      {/* GitHub-style Confirmation Input */}
      <div className="flex flex-col gap-1.5">
        <label className="text-muted-foreground leading-relaxed">
          Untuk mengonfirmasi, ketik{" "}
          <span className="font-bold text-foreground select-all bg-muted px-1.5 py-0.5 rounded-md font-mono border border-border">
            {targetConfirmText}
          </span>{" "}
          pada kolom di bawah:
        </label>
        <Input
          value={confirmInput}
          onChange={(e) => setConfirmInput(e.target.value)}
          placeholder={`Ketik "${targetConfirmText}" di sini`}
          disabled={isDeleting}
          autoFocus
          className="text-xs h-9"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-2 pt-3 border-t border-border mt-1">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isDeleting}
          className="cursor-pointer text-xs h-9"
        >
          Batal
        </Button>
        <Button
          type="submit"
          variant="destructive"
          disabled={!isMatch || isDeleting}
          className="gap-1.5 cursor-pointer shadow-2xs text-xs h-9 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDeleting ? (
            <>
              <Loader2 className="size-3.5 animate-spin" />
              <span>Menghapus...</span>
            </>
          ) : (
            <>
              <Trash2 className="size-3.5" />
              <span>Hapus Pengguna</span>
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

export function UserDeleteAlert({
  open,
  onOpenChange,
  userToDelete,
  onSuccess,
}: UserDeleteAlertProps) {
  if (!userToDelete) return null;

  return (
    <AlertDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Hapus Akun Pengguna"
      description="Konfirmasi penghapusan permanen akun pengguna dari sistem."
    >
      <UserDeleteContent
        key={userToDelete.id}
        userToDelete={userToDelete}
        onClose={() => onOpenChange(false)}
        onSuccess={onSuccess}
      />
    </AlertDialog>
  );
}
