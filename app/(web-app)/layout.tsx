import Sidebar from "@/components/layouts/sidebar";
import Header from "@/components/layouts/header";
import { ContentTop, PageContent } from "@/components/layouts/main-content";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { UserStoreHydrator } from "@/components/providers/user-store-hydrator";

export default async function WebAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currUser = await getCurrentUser();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userPayload = currUser
    ? {
        name: currUser.name,
        role: currUser.role,
      }
    : null;

  // Pengamanan lapis kedua: Jika tidak ada user aktif, lempar ke login
  if (!user || !currUser) {
    redirect("/login");
  }

  return (
    <div className="w-screen h-dvh p-2 flex gap-1.5 bg-accent overflow-hidden">
      {/* Mengisi Zustand store secara otomatis saat halaman dibuka */}
      <UserStoreHydrator user={userPayload} />

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
