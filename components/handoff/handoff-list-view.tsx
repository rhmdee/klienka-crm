"use client";

import { useState, useEffect } from "react";
import { toast } from "@/components/ui/sonner";
import { HandoffDealItem } from "./types";
import { HandoffHeader } from "./handoff-header";
import { HandoffStats } from "./handoff-stats";
import { HandoffFilterControls } from "./handoff-filter-controls";
import { HandoffTable } from "./handoff-table";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { useMemo } from "react";

export function HandoffListView() {
  const [deals, setDeals] = useState<HandoffDealItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<
    "ALL" | "ASSIGNED" | "PENDING"
  >("ALL");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    let ignore = false;

    async function loadDeals() {
      try {
        setIsLoading(true);
        const res = await fetch("/api/handoff");
        const json = await res.json();
        if (!ignore && json.success && Array.isArray(json.data)) {
          setDeals(json.data);
        } else if (!ignore) {
          toast.error("Gagal memuat daftar serah terima proyek.");
        }
      } catch (err) {
        if (!ignore) {
          console.error("Error loading handoff deals:", err);
          toast.error("Terjadi kesalahan jaringan saat memuat data.");
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadDeals();

    return () => {
      ignore = true;
    };
  }, []);

  const handleRefresh = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/handoff");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setDeals(json.data);
      } else {
        toast.error("Gagal memuat daftar serah terima proyek.");
      }
    } catch (err) {
      console.error("Error loading handoff deals:", err);
      toast.error("Terjadi kesalahan jaringan saat memuat data.");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredDeals = deals.filter((deal) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      deal.title.toLowerCase().includes(query) ||
      deal.client.companyName.toLowerCase().includes(query) ||
      deal.client.clientName.toLowerCase().includes(query) ||
      (deal.handoff?.assignedOperator &&
        deal.handoff.assignedOperator.toLowerCase().includes(query));

    const isAssigned =
      deal.handoff &&
      deal.handoff.assignedOperator &&
      deal.handoff.assignedOperator !== "PENDING_ASSIGNMENT";

    if (filterStatus === "ASSIGNED") return matchesSearch && isAssigned;
    if (filterStatus === "PENDING") return matchesSearch && !isAssigned;
    return matchesSearch;
  });

  const paginatedDeals = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredDeals.slice(startIndex, startIndex + pageSize);
  }, [filteredDeals, currentPage, pageSize]);

  const totalAssigned = deals.filter(
    (d) =>
      d.handoff &&
      d.handoff.assignedOperator &&
      d.handoff.assignedOperator !== "PENDING_ASSIGNMENT",
  ).length;
  const totalPending = deals.length - totalAssigned;

  return (
    <div className="w-full flex flex-col gap-5">
      {/* 1. Header */}
      <HandoffHeader onRefresh={handleRefresh} isLoading={isLoading} />

      {/* 2. Stats Counters */}
      <HandoffStats deals={deals} isLoading={isLoading} />

      {/* 3. Search & Filter Controls */}
      <HandoffFilterControls
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          setCurrentPage(1);
        }}
        filterStatus={filterStatus}
        onFilterStatusChange={(status) => {
          setFilterStatus(status);
          setCurrentPage(1);
        }}
        totalCount={deals.length}
        pendingCount={totalPending}
        assignedCount={totalAssigned}
      />

      {/* 4. Table / List */}
      <div className="flex flex-col border border-border rounded-xl bg-card overflow-hidden shadow-xs">
        <HandoffTable deals={paginatedDeals} isLoading={isLoading} />
        <DataTablePagination
          totalItems={filteredDeals.length}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setCurrentPage(1);
          }}
        />
      </div>
    </div>
  );
}
