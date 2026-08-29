import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { ClientItem, ClientListView } from "@/components/clients";
import { Skeleton } from "@/components/ui/skeleton";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Database Klien & Leads - Klienka CRM",
  description:
    "Kelola direktori master data kontak klien, institusi perusahaan, dan lacak asal lead.",
};

async function getClients(): Promise<ClientItem[]> {
  try {
    const clients = await prisma.client.findMany({
      include: {
        _count: {
          select: { deals: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return clients.map((c) => ({
      id: c.id,
      clientName: c.clientName,
      companyName: c.companyName,
      contactEmail: c.contactEmail,
      contactPhone: c.contactPhone,
      leadSource: c.leadSource,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
      _count: {
        deals: c._count.deals,
      },
    }));
  } catch (error) {
    console.error("Error loading clients on server:", error);
    return [];
  }
}

async function ClientsContent() {
  const clients = await getClients();
  return <ClientListView initialClients={clients} />;
}

export default function ClientsPage() {
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
        <ClientsContent />
      </Suspense>
    </div>
  );
}
