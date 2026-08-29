"use client";

import { useMemo, useState } from "react";
import { ClientItem } from "./types";
import { ClientHeader } from "./client-header";
import { ClientTable } from "./client-table";
import { ClientFormDrawer } from "./client-form-drawer";
import { ClientDeleteAlert } from "./client-delete-alert";
import { useRouter } from "next/navigation";

interface ClientListViewProps {
  initialClients: ClientItem[];
}

export function ClientListView({ initialClients }: ClientListViewProps) {
  const router = useRouter();
  const [clients, setClients] = useState<ClientItem[]>(initialClients);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [clientToEdit, setClientToEdit] = useState<ClientItem | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<ClientItem | null>(null);

  const handleRefreshData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/clients");
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setClients(data.data);
      }
      router.refresh();
    } catch (error) {
      console.error("Failed to refresh clients list:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredClients = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return clients;

    return clients.filter((c) => {
      const nameMatch = c.clientName.toLowerCase().includes(q);
      const companyMatch = c.companyName.toLowerCase().includes(q);
      const emailMatch = c.contactEmail.toLowerCase().includes(q);
      const phoneMatch = (c.contactPhone || "").toLowerCase().includes(q);
      const sourceMatch = (c.leadSource || "").toLowerCase().includes(q);

      return (
        nameMatch ||
        companyMatch ||
        emailMatch ||
        phoneMatch ||
        sourceMatch
      );
    });
  }, [clients, searchQuery]);

  const handleOpenAdd = () => {
    setClientToEdit(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (client: ClientItem) => {
    setClientToEdit(client);
    setIsFormOpen(true);
  };

  const handleOpenDelete = (client: ClientItem) => {
    setClientToDelete(client);
    setIsDeleteOpen(true);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header Module with Pipeline, Handoff & User Management Layout */}
      <ClientHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onRefresh={handleRefreshData}
        onAddClient={handleOpenAdd}
        isLoading={isLoading}
      />

      {/* Main Table Component */}
      <ClientTable
        clients={filteredClients}
        isLoading={isLoading}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
      />

      {/* Drawer Tambah / Edit Data Klien */}
      <ClientFormDrawer
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        clientToEdit={clientToEdit}
        onSuccess={handleRefreshData}
      />

      {/* Modal Konfirmasi Hapus GitHub-Style */}
      <ClientDeleteAlert
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        clientToDelete={clientToDelete}
        onSuccess={handleRefreshData}
      />
    </div>
  );
}
