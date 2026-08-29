"use client";

import { useMemo, useState, useEffect } from "react";
import { UserItem } from "./types";
import { UserHeader } from "./user-header";
import { UserTable } from "./user-table";
import { UserFormDialog } from "./user-form-dialog";
import { UserDeleteAlert } from "./user-delete-alert";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { useRouter } from "next/navigation";

interface UserListViewProps {
  initialUsers: UserItem[];
}

export function UserListView({ initialUsers }: UserListViewProps) {
  const router = useRouter();
  const [users, setUsers] = useState<UserItem[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>("ALL");
  const [isLoading, setIsLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<UserItem | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserItem | null>(null);

  const handleRefreshData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/settings/users");
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setUsers(data.data);
      }
      router.refresh();
    } catch (error) {
      console.error("Failed to refresh users list:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRole =
        selectedRoleFilter === "ALL" || u.role === selectedRoleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, selectedRoleFilter]);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredUsers.slice(startIndex, startIndex + pageSize);
  }, [filteredUsers, currentPage, pageSize]);

  // Reset to first page when filtering
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedRoleFilter]);

  const handleOpenAdd = () => {
    setUserToEdit(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (user: UserItem) => {
    setUserToEdit(user);
    setIsFormOpen(true);
  };

  const handleOpenDelete = (user: UserItem) => {
    setUserToDelete(user);
    setIsDeleteOpen(true);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header Module with Pipeline Layout */}
      <UserHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterRole={selectedRoleFilter}
        onFilterRoleChange={setSelectedRoleFilter}
        onRefresh={handleRefreshData}
        onAddUser={handleOpenAdd}
        isLoading={isLoading}
      />

      {/* Main Table Component matching Handoff Table */}
      <div className="flex flex-col border border-border rounded-xl bg-card overflow-hidden shadow-xs">
        <UserTable
          users={paginatedUsers}
          isLoading={isLoading}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
        />
        <DataTablePagination
          totalItems={filteredUsers.length}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Modal Dialog Tambah / Edit */}
      <UserFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        userToEdit={userToEdit}
        onSuccess={handleRefreshData}
      />

      {/* Modal Konfirmasi Hapus */}
      <UserDeleteAlert
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        userToDelete={userToDelete}
        onSuccess={handleRefreshData}
      />
    </div>
  );
}
