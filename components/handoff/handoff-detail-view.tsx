"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/sonner";
import { HandoffDealItem, HandoffItem } from "./types";
import { HandoffDetailHeader } from "./handoff-detail-header";
import { HandoffBriefSpec } from "./handoff-brief-spec";
import { HandoffAssignmentCard } from "./handoff-assignment-card";

interface HandoffDetailViewProps {
  dealId?: string;
}

export function HandoffDetailView({ dealId: propDealId }: HandoffDetailViewProps) {
  const routeParams = useParams();
  const dealId =
    propDealId ||
    (typeof routeParams?.dealId === "string" ? routeParams.dealId : "");

  const [deal, setDeal] = useState<HandoffDealItem | null>(null);
  const [handoff, setHandoff] = useState<HandoffItem | null>(null);
  const [availableOperators, setAvailableOperators] = useState<string[]>([]);
  const [selectedOperator, setSelectedOperator] = useState<string>("");
  const [briefNotes, setBriefNotes] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    let ignore = false;

    async function loadHandoffDetail() {
      if (!dealId) return;
      try {
        setIsLoading(true);
        const res = await fetch(`/api/handoff/${dealId}`);
        const json = await res.json();

        if (!ignore && json.success && json.data) {
          setDeal(json.data.deal);
          setHandoff(json.data.handoff);
          setAvailableOperators(json.data.availableOperators || []);

          const currentOperator = json.data.handoff?.assignedOperator;
          if (currentOperator && currentOperator !== "PENDING_ASSIGNMENT") {
            setSelectedOperator(currentOperator);
          } else if (json.data.availableOperators?.length > 0) {
            setSelectedOperator(json.data.availableOperators[0]);
          }

          setBriefNotes(json.data.handoff?.briefNotes || "");
        } else if (!ignore) {
          toast.error(json.message || "Gagal memuat detail serah terima proyek.");
        }
      } catch (err) {
        if (!ignore) {
          console.error("Error fetching handoff detail:", err);
          toast.error("Terjadi kesalahan jaringan saat memuat data.");
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadHandoffDetail();

    return () => {
      ignore = true;
    };
  }, [dealId]);

  const handleSaveAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOperator) {
      toast.error("Silakan pilih penanggung jawab teknis (operator).");
      return;
    }

    try {
      setIsSaving(true);
      const res = await fetch(`/api/handoff/${dealId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assignedOperator: selectedOperator,
          briefNotes,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        toast.error(json.message || "Gagal menyimpan penugasan operator.");
        return;
      }

      setHandoff(json.data);
      toast.success("Penugasan tim operasional berhasil diperbarui!");
    } catch (err) {
      console.error("Error saving handoff assignment:", err);
      toast.error("Terjadi kesalahan jaringan saat menyimpan penugasan.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full flex flex-col gap-4 animate-in fade-in duration-200">
        <div className="h-16 w-full rounded-xl border border-border bg-card p-4 flex items-center justify-between">
          <Skeleton className="h-6 w-48 rounded-md" />
          <Skeleton className="h-8 w-36 rounded-md" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-8 h-96 rounded-xl border border-border bg-card p-4">
            <Skeleton className="h-full w-full rounded-lg" />
          </div>
          <div className="lg:col-span-4 h-96 rounded-xl border border-border bg-card p-4">
            <Skeleton className="h-full w-full rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!deal) {
    return (
      <Card className="p-8 text-center border-border bg-card">
        <AlertCircle className="size-8 text-destructive mx-auto mb-2" />
        <h2 className="text-base font-bold text-foreground">
          Dokumen Handoff Tidak Ditemukan
        </h2>
        <p className="text-xs text-muted-foreground mt-1 mb-4">
          Data deal tidak ditemukan atau belum mencapai tahap Closed Won.
        </p>
        <Link href="/handoff">
          <Button size="sm" variant="outline" className="cursor-pointer">
            Kembali ke Daftar Handoff
          </Button>
        </Link>
      </Card>
    );
  }

  return (
    <div className="w-full flex flex-col gap-5">
      {/* 1. Header Banner */}
      <HandoffDetailHeader deal={deal} />

      {/* 2. Content 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Brief Specs (8 of 12) */}
        <div className="lg:col-span-8">
          <HandoffBriefSpec deal={deal} />
        </div>

        {/* Right Column: Assignment Form (4 of 12) */}
        <div className="lg:col-span-4">
          <HandoffAssignmentCard
            handoff={handoff}
            availableOperators={availableOperators}
            selectedOperator={selectedOperator}
            onSelectedOperatorChange={setSelectedOperator}
            briefNotes={briefNotes}
            onBriefNotesChange={setBriefNotes}
            onSave={handleSaveAssignment}
            isSaving={isSaving}
          />
        </div>
      </div>
    </div>
  );
}
