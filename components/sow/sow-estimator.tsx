"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams, useParams } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/sonner";
import { SOWEstimatorForm } from "./sow-estimator-form";
import { SOWEstimatorSummary } from "./sow-estimator-summary";
import {
  SOWRoleItem,
  DEFAULT_TECHNICAL_ROLES,
  SOWCalculationResult,
  SOWGenerateResponse,
} from "./types";
import { DealItem, STAGES } from "@/components/pipeline/types";

interface SOWEstimatorProps {
  initialDealId?: string;
}

export function SOWEstimator({ initialDealId }: SOWEstimatorProps) {
  const searchParams = useSearchParams();
  const routeParams = useParams();

  const dealId =
    initialDealId ||
    (typeof routeParams?.id === "string" ? routeParams.id : "") ||
    searchParams.get("dealId") ||
    "";

  const [deal, setDeal] = useState<DealItem | null>(null);
  const [isLoadingDeal, setIsLoadingDeal] = useState<boolean>(true);

  // SOW Items State
  const [items, setItems] = useState<SOWRoleItem[]>(() =>
    DEFAULT_TECHNICAL_ROLES.map((role, idx) => ({
      id: `role-${idx + 1}-${Date.now()}`,
      roleName: role.roleName,
      manDays: role.manDays,
      dailyRate: role.dailyRate,
      subtotal: role.manDays * role.dailyRate,
    })),
  );

  // Margin percentage with minimum 20% default
  const [marginPercentage, setMarginPercentage] = useState<number>(20);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedSOW, setGeneratedSOW] = useState<SOWGenerateResponse | null>(null);

  // Fetch deal data directly for the selected deal
  const fetchDeal = useCallback(async () => {
    try {
      setIsLoadingDeal(true);
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
          toast.error("Belum ada data prospek yang tersimpan di sistem.");
          setIsLoadingDeal(false);
          return;
        }
      }

      const res = await fetch(`/api/leads/${targetId}`);
      const json = await res.json();

      if (json.success && json.data) {
        setDeal(json.data);
      } else {
        toast.error(json.message || "Gagal memuat detail prospek.");
      }
    } catch (err) {
      console.error("Error fetching deal:", err);
      toast.error("Terjadi kesalahan jaringan saat memuat data prospek.");
    } finally {
      setIsLoadingDeal(false);
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
            return;
          }
        }

        const res = await fetch(`/api/leads/${targetId}`);
        const json = await res.json();

        if (!ignore && json.success && json.data) {
          setDeal(json.data);
        }
      } catch (err) {
        if (!ignore) {
          console.error("Error fetching deal:", err);
        }
      } finally {
        if (!ignore) {
          setIsLoadingDeal(false);
        }
      }
    }

    loadData();

    return () => {
      ignore = true;
    };
  }, [dealId]);

  // Update item field
  const handleUpdateItem = useCallback(
    (id: string, field: keyof SOWRoleItem, value: string | number) => {
      setItems((prev) =>
        prev.map((item) => {
          if (item.id !== id) return item;
          const updated = { ...item, [field]: value };
          if (field === "manDays" || field === "dailyRate") {
            const mDays = Number(field === "manDays" ? value : item.manDays) || 0;
            const dRate = Number(field === "dailyRate" ? value : item.dailyRate) || 0;
            updated.subtotal = mDays * dRate;
          }
          return updated;
        }),
      );
    },
    [],
  );

  // Add new item
  const handleAddItem = useCallback(() => {
    const newItem: SOWRoleItem = {
      id: `custom-role-${Date.now()}`,
      roleName: "Engineer Tambahan",
      manDays: 5,
      dailyRate: 1500000,
      subtotal: 5 * 1500000,
    };
    setItems((prev) => [...prev, newItem]);
  }, []);

  // Remove item
  const handleRemoveItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  // Margin Change with validation
  const handleMarginChange = useCallback((value: number) => {
    setMarginPercentage(value);
    if (value < 20) {
      toast.warning("Margin minimum yang diizinkan sistem adalah 20% (BR-SOW-02).");
    }
  }, []);

  // Dynamic Calculation
  const calculation: SOWCalculationResult = useMemo(() => {
    const baseCost = items.reduce((acc, curr) => acc + (Number(curr.subtotal) || 0), 0);
    const validMargin = Math.max(20, marginPercentage);
    const marginAmount = Math.round(baseCost * (validMargin / 100));
    const totalCost = baseCost + marginAmount;

    return {
      baseCost,
      marginPercentage: validMargin,
      marginAmount,
      totalCost,
    };
  }, [items, marginPercentage]);

  // Handle Generate SOW & Magic Link
  const handleGenerate = async () => {
    if (!deal) {
      toast.error("Data prospek belum termuat.");
      return;
    }

    if (items.length === 0 || calculation.baseCost <= 0) {
      toast.error("Harap isi alokasi peran dan man-days terlebih dahulu.");
      return;
    }

    if (marginPercentage < 20) {
      toast.warning("Margin profit minimal adalah 20% (BR-SOW-02).");
      return;
    }

    try {
      setIsGenerating(true);

      const payload = {
        dealId: deal.id,
        marginPercentage,
        items: items.map((item) => ({
          roleName: item.roleName,
          manDays: item.manDays,
          dailyRate: item.dailyRate,
        })),
      };

      const res = await fetch("/api/sow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        toast.error(json.message || "Gagal membuat dokumen SOW.");
        return;
      }

      setGeneratedSOW(json.data);
      toast.success("Dokumen SOW & Magic Link berhasil dibuat!");
    } catch (err) {
      console.error("Error generating SOW:", err);
      toast.error("Terjadi kesalahan jaringan saat membuat SOW.");
    } finally {
      setIsGenerating(false);
    }
  };

  const currentStageInfo = STAGES.find((s) => s.key === deal?.stage);

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Header Banner - Identik dengan DealDetailHeader */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-card border border-border p-4 rounded-xl shadow-xs">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            {isLoadingDeal ? (
              <Skeleton className="h-6 w-64 rounded-md" />
            ) : (
              <>
                <h1 className="text-xl font-bold text-foreground">
                  {deal?.title || "Prospek Proyek"}
                </h1>
                {deal && (
                  <Badge
                    variant="outline"
                    className={`${currentStageInfo?.badgeColor || "bg-muted text-foreground"} text-xs font-semibold px-2.5 py-0.5 rounded-full border-0`}
                  >
                    {currentStageInfo?.label || deal.stage}
                  </Badge>
                )}
              </>
            )}
          </div>
          {isLoadingDeal ? (
            <Skeleton className="h-4 w-48 rounded-md mt-1" />
          ) : (
            <p className="text-xs text-muted-foreground">
              Perusahaan:{" "}
              <span className="font-semibold text-foreground">
                {deal?.client.companyName || "-"}
              </span>
              <span className="mx-2">•</span>
              PIC:{" "}
              <span className="font-semibold text-foreground">
                {deal?.user?.name || "Tim Klienka"}
              </span>
            </p>
          )}
        </div>

        {/* Action Button: Refresh Button */}
        <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
          <Button
            size="icon-sm"
            variant="outline"
            onClick={fetchDeal}
            disabled={isLoadingDeal}
            className="p-0 cursor-pointer"
            title="Refresh Data"
          >
            <RefreshCw
              className={`size-3.5 ${isLoadingDeal ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </div>

      {/* 2-Column Desktop Grid: Left Form (8/12) & Right Summary (4/12) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Form Roles & Man-Days (8 of 12) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <SOWEstimatorForm
            items={items}
            onUpdateItem={handleUpdateItem}
            onAddItem={handleAddItem}
            onRemoveItem={handleRemoveItem}
          />
        </div>

        {/* Right Column: Margin & Cost Calculation Summary (4 of 12) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <SOWEstimatorSummary
            calculation={calculation}
            marginPercentage={marginPercentage}
            onMarginChange={handleMarginChange}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
            generatedSOW={generatedSOW}
            dealId={deal?.id}
            selectedDealTitle={deal?.title}
            selectedClientName={deal?.client.companyName}
          />
        </div>
      </div>
    </div>
  );
}
