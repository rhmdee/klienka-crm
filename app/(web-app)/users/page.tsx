import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { UserItem, UserListView } from "@/components/settings/users";
import { Skeleton } from "@/components/ui/skeleton";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Manajemen Pengguna & Tim - Klienka CRM",
  description:
    "Kelola akun pengguna, penetapan peran (RBAC), dan tanggung jawab deal CRM.",
};

async function getUsers(): Promise<UserItem[]> {
  try {
    const users = await prisma.user.findMany({
      include: {
        _count: {
          select: { deals: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      createdAt: u.createdAt.toISOString(),
      updatedAt: u.updatedAt.toISOString(),
      _count: {
        deals: u._count.deals,
      },
    }));
  } catch (error) {
    console.error("Error loading users on server:", error);
    return [];
  }
}

async function UsersContent() {
  const users = await getUsers();
  return <UserListView initialUsers={users} />;
}

export default function UsersPage() {
  return (
    <div className="w-full flex flex-col gap-4">
      <Suspense
        fallback={
          <div className="w-full flex flex-col gap-4">
            <div className="h-16 w-full rounded-2xl border border-border bg-card p-4 flex items-center justify-between">
              <Skeleton className="h-6 w-48 rounded-md" />
              <Skeleton className="h-8 w-28 rounded-md" />
            </div>
            <div className="h-10 w-full flex items-center justify-between gap-3">
              <Skeleton className="h-9 w-64 rounded-md" />
              <Skeleton className="h-9 w-48 rounded-full" />
            </div>
            <Skeleton className="h-96 rounded-2xl" />
          </div>
        }
      >
        <UsersContent />
      </Suspense>
    </div>
  );
}
