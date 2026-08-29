import * as React from "react";
import { DealDetailView } from "@/components/pipeline";

export default function PipelineDetailPage() {
  return (
    <React.Suspense
      fallback={
        <div className="p-8 text-center text-sm text-muted-foreground">
          Memuat detail prospek...
        </div>
      }
    >
      <DealDetailView />
    </React.Suspense>
  );
}
