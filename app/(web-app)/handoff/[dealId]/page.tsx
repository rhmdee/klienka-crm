import { Suspense } from "react";
import { HandoffDetailView } from "@/components/handoff";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = {
  title: "Handoff Brief - Klienka CRM",
  description: "Dokumen serah terima teknis dan penugasan operasional proyek.",
};

export default async function HandoffDetailPage({
  params,
}: {
  params: Promise<{ dealId: string }>;
}) {
  const { dealId } = await params;

  return (
    <Suspense
      fallback={
        <div className="w-full flex flex-col gap-4">
          <div className="h-16 w-full rounded-xl border border-border bg-card p-4 flex items-center justify-between">
            <Skeleton className="h-6 w-48 rounded-md" />
            <Skeleton className="h-8 w-24 rounded-md" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <Skeleton className="lg:col-span-8 h-96 rounded-xl" />
            <Skeleton className="lg:col-span-4 h-96 rounded-xl" />
          </div>
        </div>
      }
    >
      <HandoffDetailView dealId={dealId} />
    </Suspense>
  );
}
