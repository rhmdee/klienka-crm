"use client";

import { useState } from "react";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";
import { AlertTriangle, Layers, Loader2, ShieldAlert, Trash2 } from "lucide-react";
import { ClientItem } from "./types";

interface ClientDeleteAlertProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientToDelete: ClientItem | null;
  onSuccess: () => void;
}

interface ClientDeleteContentProps {
  clientToDelete: ClientItem;
  onClose: () => void;
  onSuccess: () => void;
}

function ClientDeleteContent({
  clientToDelete,
  onClose,
  onSuccess,
}: ClientDeleteContentProps) {
  const [confirmInput, setConfirmInput] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const dealsCount = clientToDelete._count?.deals ?? 0;
  const hasActiveDeals = dealsCount > 0;

  const targetConfirmText = clientToDelete.companyName;
  const isMatch = confirmInput.trim() === targetConfirmText.trim();

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (hasActiveDeals || !isMatch || isDeleting) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/clients/${clientToDelete.id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.message || "Gagal menghapus data klien.");
        return;
      }

      toast.success("Data klien berhasil dihapus dari direktori.");
      onClose();
      onSuccess();
    } catch (error) {
      console.error("Error deleting client:", error);
      toast.error("Terjadi kesalahan saat menghapus data klien.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <form onSubmit={handleDelete} className="flex flex-col gap-4 text-xs">
      {/* Jika klien masih memiliki Deal aktif: Block Deletion */}
      {hasActiveDeals ? (
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
          <ShieldAlert className="size-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="flex flex-col gap-1">
            <span className="font-semibold text-foreground text-sm">
              Penghapusan Tidak Diizinkan
            </span>
            <p className="text-muted-foreground leading-relaxed">
              Klien <strong className="text-foreground">{clientToDelete.companyName}</strong> saat ini memiliki{" "}
              <strong className="text-amber-500 font-semibold inline-flex items-center gap-1">
                <Layers className="size-3" />
                {dealsCount} Prospek / Deal
              </strong>{" "}
              yang terhubung. Untuk menjaga integritas data CRM, Anda harus menghapus atau memindahkan deal terkait terlebih dahulu.
            </p>
          </div>
        </div>
      ) : (
        /* Warning Box Normal */
        <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 flex items-start gap-3">
          <AlertTriangle className="size-5 text-destructive shrink-0 mt-0.5" />
          <div className="flex flex-col gap-1">
            <span className="font-semibold text-foreground text-sm">
              Tindakan ini tidak dapat dibatalkan
            </span>
            <p className="text-muted-foreground leading-relaxed">
              Menghapus entitas klien{" "}
              <strong className="text-foreground">
                {clientToDelete.clientName} ({clientToDelete.companyName})
              </strong>{" "}
              akan menghilangkan data kontak ini secara permanen dari database master.
            </p>
          </div>
        </div>
      )}

      {/* GitHub-style Confirmation Input (hanya jika tidak ada deal aktif) */}
      {!hasActiveDeals && (
        <div className="flex flex-col gap-1.5">
          <label className="text-muted-foreground leading-relaxed">
            Untuk mengonfirmasi, ketik{" "}
            <span className="font-bold text-foreground select-all bg-muted px-1.5 py-0.5 rounded-md border border-border">
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
      )}

      {/* Actions */}
      <div className="flex items-center justify-end gap-2 pt-3 border-t border-border mt-1">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isDeleting}
          className="cursor-pointer text-xs h-9"
        >
          {hasActiveDeals ? "Tutup" : "Batal"}
        </Button>
        {!hasActiveDeals && (
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
                <span>Hapus Klien</span>
              </>
            )}
          </Button>
        )}
      </div>
    </form>
  );
}

export function ClientDeleteAlert({
  open,
  onOpenChange,
  clientToDelete,
  onSuccess,
}: ClientDeleteAlertProps) {
  if (!clientToDelete) return null;

  return (
    <AlertDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Hapus Data Klien"
      description="Konfirmasi penghapusan kontak klien dari direktori CRM."
    >
      <ClientDeleteContent
        key={clientToDelete.id}
        clientToDelete={clientToDelete}
        onClose={() => onOpenChange(false)}
        onSuccess={onSuccess}
      />
    </AlertDialog>
  );
}
