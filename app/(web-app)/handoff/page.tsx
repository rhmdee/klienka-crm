import { Suspense } from "react";
import { HandoffListView } from "@/components/handoff";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = {
  title: "Operational Handoff - Klienka CRM",
  description: "Daftar serah terima proyek dan penunjukan operator teknis untuk deal Closed Won.",
};

export default function HandoffPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full flex flex-col gap-4">
          <div className="h-16 w-full rounded-xl border border-border bg-card p-4 flex items-center justify-between">
            <Skeleton className="h-6 w-48 rounded-md" />
            <Skeleton className="h-8 w-24 rounded-md" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Skeleton className="h-28 rounded-2xl" />
            <Skeleton className="h-28 rounded-2xl" />
            <Skeleton className="h-28 rounded-2xl" />
          </div>
          <Skeleton className="h-80 rounded-xl" />
        </div>
      }
    >
      <HandoffListView />
    </Suspense>
  );
}
