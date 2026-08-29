import { Suspense } from "react";
import { DealDetailView } from "@/components/pipeline";
import { DealDetailSkeleton } from "@/components/pipeline/detail";

export default async function DealDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Suspense fallback={<DealDetailSkeleton />}>
      <DealDetailView dealId={id} />
    </Suspense>
  );
}
