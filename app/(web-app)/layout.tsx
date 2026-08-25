import Sidebar from "@/components/layouts/sidebar";
import Header from "@/components/layouts/header";
import { ContentTop, PageContent } from "@/components/layouts/main-content";

export default function WebAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-screen h-screen p-2 flex gap-1.5 bg-accent overflow-hidden">
      {/* Sidebar Component with responsive fixed (mobile) / static (lg) */}
      <Sidebar />

      {/* Main Container */}
      <main className="flex flex-1 flex-col gap-1.5 min-w-0 h-full overflow-hidden">
        {/* Mobile / Tablet Portrait Header (hidden on lg:) */}
        <Header />

        {/* Main Content Area */}
        <div className="flex-1 bg-background rounded-2xl border border-border flex flex-col min-h-0 overflow-hidden shadow-xs">
          {/* Top Bar for Desktop & Tablet Landscape (visible on lg:) */}
          <ContentTop />

          {/* Page Content */}
          <PageContent>{children}</PageContent>
        </div>
      </main>
    </div>
  );
}
