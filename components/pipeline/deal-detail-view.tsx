"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useParams } from "next/navigation";
import Link from "next/link";
import { AlertCircle, Layers, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { getRoleHeaders } from "@/lib/api-client";
import { EditDealDrawer } from "./edit-deal-drawer";
import {
  DealDetailHeader,
  DealDetailStepper,
  DealDetailProjectInfo,
  DealDetailActivityTimeline,
  DealDetailFinancialCard,
  DealDetailClientCard,
  DealDetailPicCard,
  DealDetailSkeleton,
} from "./detail";
import {
  DealItem,
  DealStage,
  DealActivityItem,
  ActivityType,
  STAGES,
} from "./types";

interface DealDetailViewProps {
  dealId?: string;
}

export function DealDetailView({ dealId: propDealId }: DealDetailViewProps = {}) {
  const searchParams = useSearchParams();
  const routeParams = useParams();
  
  const dealId =
    propDealId ||
    (typeof routeParams?.id === "string" ? routeParams.id : "") ||
    searchParams.get("id");

  const [deal, setDeal] = useState<DealItem | null>(null);
  const [activities, setActivities] = useState<DealActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isAddingActivity, setIsAddingActivity] = useState<boolean>(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Manual refresh handler
  const fetchDealDetail = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);

      let targetId = dealId;

      if (!targetId) {
        const listRes = await fetch("/api/leads");
        const listJson = await listRes.json();
        if (
          listJson.success &&
          Array.isArray(listJson.data) &&
          listJson.data.length > 0
        ) {
          targetId = listJson.data[0].id;
        } else {
          setErrorMessage("Belum ada data prospek yang tersimpan di sistem.");
          setIsLoading(false);
          return;
        }
      }

      const res = await fetch(`/api/leads/${targetId}`);
      const json = await res.json();

      if (!res.ok || !json.success || !json.data) {
        setErrorMessage(json.message || "Gagal memuat detail prospek.");
        return;
      }

      setDeal(json.data);
      if (Array.isArray(json.data.activities)) {
        setActivities(json.data.activities);
      }
    } catch (err) {
      console.error("Error fetching deal detail:", err);
      setErrorMessage(
        "Terjadi kesalahan jaringan saat mengambil detail prospek.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [dealId]);

  useEffect(() => {
    let ignore = false;

    async function loadData() {
      try {
        let targetId = dealId;

        if (!targetId) {
          const listRes = await fetch("/api/leads");
          const listJson = await listRes.json();
          if (
            listJson.success &&
            Array.isArray(listJson.data) &&
            listJson.data.length > 0
          ) {
            targetId = listJson.data[0].id;
          } else {
            if (!ignore) {
              setErrorMessage(
                "Belum ada data prospek yang tersimpan di sistem.",
              );
              setIsLoading(false);
            }
            return;
          }
        }

        const res = await fetch(`/api/leads/${targetId}`);
        const json = await res.json();

        if (!ignore) {
          if (!res.ok || !json.success || !json.data) {
            setErrorMessage(json.message || "Gagal memuat detail prospek.");
          } else {
            setDeal(json.data);
            if (Array.isArray(json.data.activities)) {
              setActivities(json.data.activities);
            }
          }
        }
      } catch (err) {
        if (!ignore) {
          console.error("Error fetching deal detail:", err);
          setErrorMessage(
            "Terjadi kesalahan jaringan saat mengambil detail prospek.",
          );
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadData();

    return () => {
      ignore = true;
    };
  }, [dealId]);

  // Handle stage transition
  const handleUpdateStage = async (targetStage: DealStage) => {
    if (!deal || deal.stage === targetStage || isUpdating) return;

    try {
      setIsUpdating(true);

      const payload: {
        stage: DealStage;
        estimatedBudget?: number;
        techStack?: string[];
        lossReason?: string;
      } = {
        stage: targetStage,
      };

      if (targetStage === "DISCOVERY_CALL") {
        payload.estimatedBudget =
          Number(deal.estimatedBudget) > 0
            ? Number(deal.estimatedBudget)
            : 10000000;
        payload.techStack =
          deal.techStack && deal.techStack.length > 0
            ? deal.techStack
            : ["Next.js", "PostgreSQL"];
      }

      if (targetStage === "CLOSED_LOST") {
        payload.lossReason = "Ditandai Lost melalui halaman detail";
      }

      const res = await fetch(`/api/leads/${deal.id}/stage`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...getRoleHeaders(),
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        toast.error(json.message || "Gagal memperbarui status stage prospek.");
        return;
      }

      setDeal((prev) =>
        prev
          ? {
              ...prev,
              stage: targetStage,
              estimatedBudget: payload.estimatedBudget ?? prev.estimatedBudget,
              techStack: payload.techStack ?? prev.techStack,
              lossReason: payload.lossReason ?? prev.lossReason,
            }
          : null,
      );

      const stageConfig = STAGES.find((s) => s.key === targetStage);

      // Auto-log activity on stage change
      const actRes = await fetch(`/api/leads/${deal.id}/activities`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "STAGE_CHANGE",
          title: `Tahap Berubah ke ${stageConfig?.label || targetStage}`,
          description: `Status prospek berhasil diperbarui ke tahap ${stageConfig?.label || targetStage}.`,
          actorName: deal.user?.name || "Tim BD",
        }),
      });
      const actJson = await actRes.json();
      if (actJson.success && actJson.data) {
        setActivities((prev) => [actJson.data, ...prev]);
      }

      toast.success(
        `Status prospek berhasil diubah ke "${stageConfig?.label || targetStage}".`,
      );
    } catch (error) {
      console.error("Update stage error:", error);
      toast.error("Terjadi kesalahan saat menghubungkan ke server.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Add new activity
  const handleAddActivity = async (type: ActivityType, text: string) => {
    if (!deal || !text.trim() || isAddingActivity) return;

    const titles: Record<ActivityType, string> = {
      NOTE: "Catatan Internal",
      EMAIL: "Log Pengiriman Email",
      CALL: "Log Panggilan Telepon",
      MEETING: "Log Rapat / Pertemuan",
      STAGE_CHANGE: "Pembaruan Status Stage",
    };

    try {
      setIsAddingActivity(true);

      const payload = {
        type,
        title: titles[type] || "Aktivitas Baru",
        description: text.trim(),
        actorName: deal.user?.name || "Tim BD",
      };

      const res = await fetch(`/api/leads/${deal.id}/activities`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        toast.error(json.message || "Gagal mencatat aktivitas ke database.");
        return;
      }

      setActivities((prev) => [json.data, ...prev]);
      toast.success("Aktivitas baru berhasil disimpan ke database.");
    } catch (err) {
      console.error("Error creating activity:", err);
      toast.error("Terjadi kesalahan jaringan saat menyimpan aktivitas.");
    } finally {
      setIsAddingActivity(false);
    }
  };

  // Loading State with Skeleton UI
  if (isLoading) {
    return <DealDetailSkeleton />;
  }

  // Error or Not Found State
  if (errorMessage || !deal) {
    return (
      <div className="w-full flex flex-col items-center justify-center p-12 gap-4 text-center">
        <AlertCircle className="size-10 text-destructive/80" />
        <div className="flex flex-col gap-1 max-w-md">
          <h2 className="text-lg font-semibold text-foreground">
            {errorMessage || "Prospek Tidak Ditemukan"}
          </h2>
          <p className="text-xs text-muted-foreground">
            Pastikan Anda memilih prospek yang valid dari halaman Pipeline
            Management.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={fetchDealDetail}
            className="gap-1.5 cursor-pointer"
          >
            <RefreshCw className="size-3.5" />
            <span>Coba Lagi</span>
          </Button>
          <Link href="/pipeline">
            <Button size="sm" className="gap-1.5 cursor-pointer">
              <Layers className="size-3.5" />
              <span>Buka Pipeline</span>
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-2.5">
      {/* 1. Header Banner */}
      <DealDetailHeader
        deal={deal}
        onUpdateStage={handleUpdateStage}
        onRefresh={fetchDealDetail}
        isLoading={isLoading}
        isUpdating={isUpdating}
      />

      {/* 2. Visual Stepper */}
      <DealDetailStepper
        deal={deal}
        onUpdateStage={handleUpdateStage}
        isUpdating={isUpdating}
      />

      {/* 3. Main Grid (Left Content + Right Sidebar) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2.5">
        {/* Left Column: Ruang Lingkup & Riwayat Aktivitas */}
        <div className="lg:col-span-2 flex flex-col gap-2.5">
          <DealDetailProjectInfo
            deal={deal}
            onOpenEditDrawer={() => setIsEditDialogOpen(true)}
          />

          <DealDetailActivityTimeline
            activities={activities}
            onAddActivity={handleAddActivity}
            isAddingActivity={isAddingActivity}
          />
        </div>

        {/* Right Column: Sidebar Finansial, Klien, PIC */}
        <div className="flex flex-col gap-2.5">
          <DealDetailFinancialCard deal={deal} />
          <DealDetailClientCard deal={deal} />
          <DealDetailPicCard deal={deal} />
        </div>
      </div>

      {/* 4. Edit Deal Drawer */}
      <EditDealDrawer
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        deal={deal}
        onSuccess={(updatedDeal) => {
          setDeal(updatedDeal);
          toast.success("Informasi prospek berhasil diperbarui.");
        }}
      />
    </div>
  );
}
