import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import {
  GeneralParamItem,
  ParamsListView,
} from "@/components/general-params";
import { Skeleton } from "@/components/ui/skeleton";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Parameter Sistem - Klienka CRM",
  description:
    "Kelola master data parameter sistem, rate card, dan operator teknis.",
};

async function getGeneralParams(): Promise<GeneralParamItem[]> {
  try {
    const params = await prisma.generalParam.findMany({
      orderBy: { paramKey: "asc" },
    });

    return params.map((p) => ({
      id: p.id,
      paramKey: p.paramKey,
      paramValue: p.paramValue,
      description: p.description,
    }));
  } catch (error) {
    console.error("Error loading general params on server:", error);
    return [];
  }
}

async function ParamsContent() {
  const params = await getGeneralParams();
  return <ParamsListView initialParams={params} />;
}

export default function GeneralParamsPage() {
  return (
    <div className="w-full flex flex-col gap-4">
      <Suspense
        fallback={
          <div className="w-full flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex flex-col gap-1.5">
                <Skeleton className="h-7 w-48 rounded-md" />
                <Skeleton className="h-4 w-72 rounded-md" />
              </div>
              <Skeleton className="h-9 w-36 rounded-md" />
            </div>
            <div className="flex items-center justify-between gap-3">
              <Skeleton className="h-9 w-64 rounded-md" />
              <Skeleton className="h-9 w-24 rounded-md" />
            </div>
            <Skeleton className="h-96 rounded-2xl" />
          </div>
        }
      >
        <ParamsContent />
      </Suspense>
    </div>
  );
}
