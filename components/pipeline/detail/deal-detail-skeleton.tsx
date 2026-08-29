"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function DealDetailSkeleton() {
  return (
    <div className="w-full flex flex-col gap-2.5 animate-in fade-in duration-300">
      {/* Top Banner Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-card border border-border p-4 rounded-xl shadow-xs">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2.5">
            <Skeleton className="h-7 w-64 rounded-md" />
            <Skeleton className="h-5 w-24 rounded-full" />
          </div>
          <Skeleton className="h-4 w-72 rounded-md" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-24 rounded-md" />
          <Skeleton className="h-8 w-24 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </div>

      {/* Stepper Card Skeleton */}
      <Card className="p-4 border-border bg-card">
        <div className="flex items-center justify-between mb-2.5">
          <Skeleton className="h-3.5 w-40 rounded-md" />
          <Skeleton className="h-3.5 w-48 rounded-md" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 pt-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      </Card>

      {/* Main 2-Col Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2.5">
        {/* Left Column */}
        <div className="lg:col-span-2 flex flex-col gap-2.5">
          {/* Project Details Card Skeleton */}
          <Card className="p-4 border-border bg-card flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-border pb-2.5">
              <Skeleton className="h-4 w-56 rounded-md" />
              <Skeleton className="h-7 w-16 rounded-md" />
            </div>
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-4/5 rounded-md" />
            </div>
            <div className="pt-2 border-t border-border/60 flex flex-col gap-2">
              <Skeleton className="h-3.5 w-48 rounded-md" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20 rounded-md" />
                <Skeleton className="h-6 w-24 rounded-md" />
                <Skeleton className="h-6 w-16 rounded-md" />
              </div>
            </div>
          </Card>

          {/* Activity Timeline Card Skeleton */}
          <Card className="p-4 border-border bg-card flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-border pb-2.5">
              <Skeleton className="h-4 w-48 rounded-md" />
              <Skeleton className="h-7 w-52 rounded-lg" />
            </div>
            {/* Quick Add Skeleton Box */}
            <Skeleton className="h-24 w-full rounded-xl" />
            {/* Timeline Items */}
            <div className="flex flex-col gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Skeleton className="size-8 rounded-full shrink-0" />
                  <div className="flex-1 p-3 border border-border rounded-xl flex flex-col gap-2 bg-background">
                    <div className="flex justify-between">
                      <Skeleton className="h-3.5 w-36 rounded-md" />
                      <Skeleton className="h-3 w-20 rounded-md" />
                    </div>
                    <Skeleton className="h-3 w-full rounded-md" />
                    <Skeleton className="h-2.5 w-24 rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column (Sidebar) */}
        <div className="flex flex-col gap-2.5">
          {/* Financial Card Skeleton */}
          <Card className="p-4 border-border bg-card flex flex-col gap-3">
            <Skeleton className="h-4 w-36 rounded-md" />
            <Skeleton className="h-8 w-44 rounded-md" />
            <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-border/60">
              <div className="flex flex-col gap-1">
                <Skeleton className="h-3 w-20 rounded-md" />
                <Skeleton className="h-4 w-24 rounded-md" />
              </div>
              <div className="flex flex-col gap-1">
                <Skeleton className="h-3 w-20 rounded-md" />
                <Skeleton className="h-4 w-24 rounded-md" />
              </div>
            </div>
          </Card>

          {/* Client Card Skeleton */}
          <Card className="p-4 border-border bg-card flex flex-col gap-3">
            <Skeleton className="h-4 w-36 rounded-md" />
            <div className="flex flex-col gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <Skeleton className="size-4 rounded-full shrink-0" />
                  <div className="flex flex-col gap-1 flex-1">
                    <Skeleton className="h-2.5 w-16 rounded-md" />
                    <Skeleton className="h-3.5 w-32 rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* PIC Card Skeleton */}
          <Card className="p-4 border-border bg-card flex flex-col gap-2.5">
            <Skeleton className="h-4 w-32 rounded-md" />
            <div className="flex items-center gap-3">
              <Skeleton className="size-9 rounded-full" />
              <div className="flex flex-col gap-1">
                <Skeleton className="h-3.5 w-28 rounded-md" />
                <Skeleton className="h-2.5 w-36 rounded-md" />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
