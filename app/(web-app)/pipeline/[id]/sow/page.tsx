import { Suspense } from "react";
import { SOWEstimator } from "@/components/sow";
import { Skeleton } from "@/components/ui/skeleton";

function SOWPageFallback() {
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

export default async function DealSOWPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Suspense fallback={<SOWPageFallback />}>
      <SOWEstimator initialDealId={id} />
    </Suspense>
  );
}
