import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import {
  DashboardHeader,
  DashboardStats,
  DashboardStatsSkeleton,
  DashboardRecentDeals,
  DashboardRecentHandoffs,
  DashboardStatsData,
  RecentDealItem,
  RecentHandoffItem,
} from "@/components/dashboard";
import { Skeleton } from "@/components/ui/skeleton";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Dashboard Overview - Klienka CRM",
  description:
    "Ringkasan performa penjualan, pipeline aktif, dan serah terima operasional software house.",
};

async function getDashboardData() {
  try {
    // 1. Ambil data deals & handoffs sekaligus
    const [allDeals, recentDealsRaw, allHandoffs, recentHandoffsRaw] =
      await Promise.all([
        prisma.deal.findMany({
          select: {
            id: true,
            stage: true,
            estimatedBudget: true,
          },
        }),
        prisma.deal.findMany({
          take: 5,
          orderBy: { updatedAt: "desc" },
          include: {
            client: {
              select: {
                clientName: true,
                companyName: true,
              },
            },
            user: {
              select: {
                name: true,
              },
            },
          },
        }),
        prisma.handoff.findMany({
          select: {
            id: true,
            assignedOperator: true,
          },
        }),
        prisma.handoff.findMany({
          take: 5,
          orderBy: { updatedAt: "desc" },
          include: {
            deal: {
              select: {
                title: true,
                client: {
                  select: {
                    companyName: true,
                  },
                },
              },
            },
          },
        }),
      ]);

    // 2. Kalkulasi Metrik Utama
    const activeDeals = allDeals.filter(
      (d) => d.stage !== "CLOSED_WON" && d.stage !== "CLOSED_LOST",
    );
    const closedWonDeals = allDeals.filter((d) => d.stage === "CLOSED_WON");

    const activePipelineValue = activeDeals.reduce(
      (sum, d) => sum + Number(d.estimatedBudget || 0),
      0,
    );
    const closedWonValue = closedWonDeals.reduce(
      (sum, d) => sum + Number(d.estimatedBudget || 0),
      0,
    );

    const totalHandoffs = allHandoffs.length;
    const assignedHandoffs = allHandoffs.filter(
      (h) => h.assignedOperator && h.assignedOperator !== "PENDING_ASSIGNMENT",
    ).length;
    const pendingHandoffs = totalHandoffs - assignedHandoffs;

    const stats: DashboardStatsData = {
      activeDealsCount: activeDeals.length,
      totalDealsCount: allDeals.length,
      activePipelineValue,
      closedWonCount: closedWonDeals.length,
      closedWonValue,
      totalHandoffs,
      assignedHandoffs,
      pendingHandoffs,
    };

    // 3. Transformasi Recent Deals
    const recentDeals: RecentDealItem[] = recentDealsRaw.map((d) => ({
      id: d.id,
      title: d.title,
      stage: d.stage,
      estimatedBudget: Number(d.estimatedBudget || 0),
      client: {
        clientName: d.client.clientName,
        companyName: d.client.companyName,
      },
      user: d.user ? { name: d.user.name } : null,
      updatedAt: d.updatedAt.toISOString(),
    }));

    // 4. Transformasi Recent Handoffs
    const recentHandoffs: RecentHandoffItem[] = recentHandoffsRaw.map((h) => ({
      id: h.id,
      dealId: h.dealId,
      dealTitle: h.deal.title,
      companyName: h.deal.client.companyName,
      assignedOperator: h.assignedOperator,
      briefNotes: h.briefNotes,
      updatedAt: h.updatedAt.toISOString(),
    }));

    return { stats, recentDeals, recentHandoffs };
  } catch (error) {
    console.error("Failed to load dashboard data:", error);
    return {
      stats: {
        activeDealsCount: 0,
        totalDealsCount: 0,
        activePipelineValue: 0,
        closedWonCount: 0,
        closedWonValue: 0,
        totalHandoffs: 0,
        assignedHandoffs: 0,
        pendingHandoffs: 0,
      },
      recentDeals: [],
      recentHandoffs: [],
    };
  }
}

async function DashboardContent() {
  const { stats, recentDeals, recentHandoffs } = await getDashboardData();

  return (
    <div className="flex flex-col gap-5">
      {/* Metrics Cards */}
      <DashboardStats stats={stats} />

      {/* Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5">
        <DashboardRecentDeals deals={recentDeals} />
        <DashboardRecentHandoffs handoffs={recentHandoffs} />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="w-full flex flex-col gap-4 p-1 sm:p-2">
      <DashboardHeader />
      <Suspense
        fallback={
          <div className="flex flex-col gap-5">
            <DashboardStatsSkeleton />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Skeleton className="h-72 rounded-2xl" />
              <Skeleton className="h-72 rounded-2xl" />
            </div>
          </div>
        }
      >
        <DashboardContent />
      </Suspense>
    </div>
  );
}
