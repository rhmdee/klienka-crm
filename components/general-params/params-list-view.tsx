"use client";

import { useMemo, useState } from "react";
import { GeneralParamItem } from "./types";
import { ParamsHeader } from "./params-header";
import { ParamsTable } from "./params-table";
import { ParamFormDialog } from "./param-form-dialog";
import { ParamDeleteAlert } from "./param-delete-alert";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { useRouter } from "next/navigation";

interface ParamsListViewProps {
  initialParams: GeneralParamItem[];
}

export function ParamsListView({ initialParams }: ParamsListViewProps) {
  const router = useRouter();
  const [params, setParams] = useState<GeneralParamItem[]>(initialParams);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [paramToEdit, setParamToEdit] = useState<GeneralParamItem | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [paramToDelete, setParamToDelete] = useState<GeneralParamItem | null>(
    null,
  );

  const handleRefreshData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/general-params");
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setParams(data.data);
      }
      router.refresh();
    } catch (error) {
      console.error("Failed to refresh general params list:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredParams = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return params;

    return params.filter((p) => {
      const keyMatch = p.paramKey.toLowerCase().includes(q);
      const valMatch = p.paramValue.toLowerCase().includes(q);
      const descMatch = (p.description || "").toLowerCase().includes(q);
      return keyMatch || valMatch || descMatch;
    });
  }, [params, searchQuery]);

  const paginatedParams = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredParams.slice(startIndex, startIndex + pageSize);
  }, [filteredParams, currentPage, pageSize]);

  const handleOpenAdd = () => {
    setParamToEdit(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (param: GeneralParamItem) => {
    setParamToEdit(param);
    setIsFormOpen(true);
  };

  const handleOpenDelete = (param: GeneralParamItem) => {
    setParamToDelete(param);
    setIsDeleteOpen(true);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header Module with Pipeline & User Management Layout */}
      <ParamsHeader
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          setCurrentPage(1);
        }}
        onRefresh={handleRefreshData}
        onAddParam={handleOpenAdd}
        isLoading={isLoading}
      />

      {/* Main Table Component matching Handoff Table */}
      <div className="flex flex-col border border-border rounded-xl bg-card overflow-hidden shadow-xs">
        <ParamsTable
          params={paginatedParams}
          isLoading={isLoading}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
        />
        <DataTablePagination
          totalItems={filteredParams.length}
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
      <ParamFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        paramToEdit={paramToEdit}
        onSuccess={handleRefreshData}
      />

      {/* Modal Konfirmasi Hapus GitHub-Style */}
      <ParamDeleteAlert
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        paramToDelete={paramToDelete}
        onSuccess={handleRefreshData}
      />
    </div>
  );
}
