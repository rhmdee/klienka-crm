"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  DealItem,
  DealStage,
  PipelineStats,
  PipelineStatsSkeleton,
  PipelineHeader,
  KanbanBoard,
  KanbanBoardSkeleton,
  PipelineListView,
  PipelineListViewSkeleton,
} from "@/components/pipeline";
import { toast } from "@/components/ui/sonner";

export function PipelineView() {
  const [deals, setDeals] = useState<DealItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [updatingDealId, setUpdatingDealId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStage, setFilterStage] = useState<string>("ALL");

  // Fetch leads data from API
  const fetchDeals = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/leads");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setDeals(json.data);
      } else {
        toast.error(json.message || "Gagal memuat data leads.");
      }
    } catch (error) {
      console.error("Error fetching deals:", error);
      toast.error("Terjadi kesalahan jaringan saat mengambil data leads.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;

    async function loadDeals() {
      try {
        const res = await fetch("/api/leads");
        const json = await res.json();
        if (!ignore) {
          if (json.success && Array.isArray(json.data)) {
            setDeals(json.data);
          } else {
            toast.error(json.message || "Gagal memuat data leads.");
          }
        }
      } catch (error) {
        if (!ignore) {
          console.error("Error fetching deals:", error);
          toast.error("Terjadi kesalahan jaringan saat mengambil data leads.");
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

  // Filter Deals berdasarkan search query dan filter dropdown
  const filteredDeals = useMemo(() => {
    return deals.filter((deal) => {
      const matchesStage = filterStage === "ALL" || deal.stage === filterStage;

      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        deal.title.toLowerCase().includes(query) ||
        deal.client.clientName.toLowerCase().includes(query) ||
        deal.client.companyName.toLowerCase().includes(query) ||
        deal.client.contactEmail.toLowerCase().includes(query) ||
        (deal.techStack &&
          deal.techStack.some((t) => t.toLowerCase().includes(query)));

      return matchesStage && matchesSearch;
    });
  }, [deals, searchQuery, filterStage]);

  // Handle Drag / Click Move Stage
  const handleMoveStage = async (dealId: string, targetStage: DealStage) => {
    const deal = deals.find((d) => d.id === dealId);
    if (!deal || deal.stage === targetStage) return;

    // Aturan BR-PIP-02: Jika pindah ke DISCOVERY_CALL, validasi budget (>0) dan techStack (min 1)
    if (targetStage === "DISCOVERY_CALL") {
      const budgetNum = Number(deal.estimatedBudget || 0);
      if (budgetNum <= 0 || !deal.techStack || deal.techStack.length === 0) {
        toast.warning(
          "Estimasi budget (>0) dan minimal satu tech stack wajib diisi untuk masuk ke Discovery (BR-PIP-02).",
        );
        return;
      }
    }

    try {
      setUpdatingDealId(dealId);

      // Optimistic update
      setDeals((prev) =>
        prev.map((d) => (d.id === dealId ? { ...d, stage: targetStage } : d)),
      );

      const res = await fetch(`/api/leads/${dealId}/stage`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stage: targetStage,
          ...(targetStage === "CLOSED_LOST"
            ? { lossReason: "Ditandai Lost dari Kanban" }
            : {}),
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        // Rollback optimistic update
        setDeals((prev) =>
          prev.map((d) => (d.id === dealId ? { ...d, stage: deal.stage } : d)),
        );
        toast.error(json.message || "Gagal mengubah status stage prospek.");
        return;
      }

      toast.success(
        `Status Deal "${deal.title}" berhasil diubah ke ${targetStage.replace("_", " ")}.`,
      );
    } catch (error) {
      console.error("Update stage error:", error);
      toast.error("Terjadi kesalahan saat menghubungi server.");
    } finally {
      setUpdatingDealId(null);
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Header & Filter & View Mode Component */}
      <PipelineHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterStage={filterStage}
        onFilterStageChange={setFilterStage}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onRefresh={fetchDeals}
        isLoading={isLoading}
      />

      {/* KPI Stats Component with Skeleton */}
      {isLoading ? <PipelineStatsSkeleton /> : <PipelineStats deals={deals} />}

      {/* View Switch: Render only ONE view at a time (with Skeletons) */}
      {isLoading ? (
        viewMode === "kanban" ? (
          <KanbanBoardSkeleton />
        ) : (
          <PipelineListViewSkeleton />
        )
      ) : viewMode === "kanban" ? (
        <KanbanBoard
          deals={filteredDeals}
          onMoveStage={handleMoveStage}
          updatingDealId={updatingDealId}
        />
      ) : (
        <PipelineListView
          deals={filteredDeals}
          onMoveStage={handleMoveStage}
          updatingDealId={updatingDealId}
        />
      )}
    </div>
  );
}
