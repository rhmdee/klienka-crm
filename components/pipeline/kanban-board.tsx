"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { KanbanColumn } from "./kanban-column";
import { DealItem, DealStage, STAGES } from "./types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

interface KanbanBoardProps {
  deals: DealItem[];
  onMoveStage: (dealId: string, stage: DealStage) => void;
  updatingDealId: string | null;
}

export function KanbanBoard({
  deals,
  onMoveStage,
  updatingDealId,
}: KanbanBoardProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const hasOverflow = el.scrollWidth > el.clientWidth + 5;
    setCanScrollLeft(el.scrollLeft > 15);
    setCanScrollRight(
      hasOverflow && el.scrollLeft < el.scrollWidth - el.clientWidth - 15,
    );
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);

    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll, deals]);

  const handleScroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollAmount = 340;
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative flex flex-col gap-2">
      {/* Scroll Navigation Header Helper */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          {canScrollRight && (
            <button
              onClick={() => handleScroll("right")}
              className="inline-flex items-center gap-1.5 text-xs text-primary dark:text-foreground hover:underline font-medium cursor-pointer animate-pulse transition-opacity"
            >
              <span>Geser ke kanan untuk stage lainnya</span>
              <ArrowRight className="size-3.5" />
            </button>
          )}
        </div>

        {/* Scroll Control Arrows */}
        <div className="flex items-center gap-1.5 ml-auto">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleScroll("left")}
            disabled={!canScrollLeft}
            className="h-8 w-8 p-0 rounded-md disabled:opacity-30 cursor-pointer"
            title="Scroll ke kiri"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleScroll("right")}
            disabled={!canScrollRight}
            className="h-8 w-8 p-0 rounded-md disabled:opacity-30 cursor-pointer"
            title="Scroll ke kanan"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      {/* Main Board Container */}
      <div className="relative">
        {/* Left Shadow Gradient Indicator */}
        {canScrollLeft && (
          <div className="pointer-events-none absolute left-0 top-0 bottom-4 w-10 bg-linear-to-r from-background to-transparent z-10 transition-opacity" />
        )}

        {/* Scrollable Columns with 10px gap */}
        <div
          ref={scrollRef}
          className="flex gap-2.5 overflow-x-auto pb-4 pt-1 items-start min-h-137.5 scroll-smooth select-none"
        >
          {STAGES.map((stage) => {
            const stageDeals = deals.filter((d) => d.stage === stage.key);
            return (
              <KanbanColumn
                key={stage.key}
                stage={stage}
                deals={stageDeals}
                onMoveStage={onMoveStage}
                updatingDealId={updatingDealId}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function KanbanBoardSkeleton() {
  return (
    <div className="relative flex flex-col gap-2 animate-in fade-in duration-300">
      {/* Scroll Navigation Header Skeleton */}
      <div className="flex items-center justify-between px-1">
        <Skeleton className="h-4 w-48 rounded-md" />
        <div className="flex items-center gap-1.5 ml-auto">
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </div>

      {/* Columns Skeleton */}
      <div className="flex gap-2.5 overflow-x-auto pb-4 pt-1 items-start min-h-137.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="shrink-0 w-80 bg-accent/50 rounded-xl border border-border flex flex-col gap-2.5 p-3.5"
          >
            {/* Header Column Skeleton */}
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <Skeleton className="h-4 w-28 rounded-md" />
              <Skeleton className="h-5 w-6 rounded-full" />
            </div>
            <div className="flex items-center justify-between pb-1">
              <Skeleton className="h-3 w-32 rounded-md" />
              <Skeleton className="h-3 w-20 rounded-md" />
            </div>
            {/* Deal Cards Skeleton */}
            <div className="flex flex-col gap-2.5 pt-1">
              {Array.from({ length: i % 2 === 0 ? 3 : 2 }).map((_, j) => (
                <div
                  key={j}
                  className="p-3.5 rounded-lg bg-background border border-border shadow-xs flex flex-col gap-2.5"
                >
                  <div className="flex justify-between items-start">
                    <Skeleton className="h-4 w-40 rounded-md" />
                    <Skeleton className="size-4 rounded-md" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Skeleton className="h-3 w-32 rounded-md" />
                    <Skeleton className="h-2.5 w-44 rounded-md" />
                  </div>
                  <div className="flex gap-1">
                    <Skeleton className="h-4 w-14 rounded-md" />
                    <Skeleton className="h-4 w-16 rounded-md" />
                  </div>
                  <div className="pt-2 border-t border-border flex justify-between items-center">
                    <Skeleton className="h-3.5 w-24 rounded-md" />
                    <Skeleton className="h-6 w-14 rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
