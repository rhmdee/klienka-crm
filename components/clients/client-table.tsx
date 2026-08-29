"use client";

import {
  Building2,
  Edit2,
  Mail,
  Phone,
  Tag,
  Trash2,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ClientItem } from "./types";

interface ClientTableProps {
  clients: ClientItem[];
  isLoading?: boolean;
  onEdit: (client: ClientItem) => void;
  onDelete: (client: ClientItem) => void;
}

export function ClientTable({
  clients,
  isLoading = false,
  onEdit,
  onDelete,
}: ClientTableProps) {
  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full text-xs text-left border-collapse block md:table">
        <thead className="hidden md:table-header-group">
          <tr className="border-b border-border bg-muted/40 text-muted-foreground font-medium">
            <th className="py-3 px-4 w-1/3">Klien & Perusahaan</th>
            <th className="py-3 px-4 w-1/4">Informasi Kontak</th>
            <th className="py-3 px-4 w-1/6">Sumber Prospek</th>
            <th className="py-3 px-4 text-center w-28">Total Prospek</th>
            <th className="py-3 px-4 text-right w-24">Aksi</th>
          </tr>
        </thead>
        <tbody className="block p-1.5 lg:p-0 md:table-row-group divide-y md:divide-border md:divide-y">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <tr
                key={i}
                className="animate-pulse block md:table-row mb-1.5 md:mb-0 border border-border md:border-transparent md:border-b-border last:md:border-b-transparent rounded-lg lg:rounded-xl md:rounded-none overflow-hidden bg-card md:bg-transparent"
              >
                <td
                  data-title="Klien & Perusahaan"
                  className="flex items-center justify-between md:table-cell py-3 px-4 border-b border-border/50 md:border-0 before:content-[attr(data-title)] before:font-medium before:text-muted-foreground md:before:hidden last:border-0"
                >
                  <div className="flex flex-col items-end md:items-start gap-1.5">
                    <Skeleton className="h-4 w-36 rounded-md" />
                    <Skeleton className="h-3 w-48 rounded-md" />
                  </div>
                </td>
                <td
                  data-title="Informasi Kontak"
                  className="flex items-center justify-between md:table-cell py-3 px-4 border-b border-border/50 md:border-0 before:content-[attr(data-title)] before:font-medium before:text-muted-foreground md:before:hidden last:border-0"
                >
                  <div className="flex flex-col items-end md:items-start gap-1.5">
                    <Skeleton className="h-3.5 w-40 rounded-md" />
                    <Skeleton className="h-3 w-28 rounded-md" />
                  </div>
                </td>
                <td
                  data-title="Sumber Prospek"
                  className="flex items-center justify-between md:table-cell py-3 px-4 border-b border-border/50 md:border-0 before:content-[attr(data-title)] before:font-medium before:text-muted-foreground md:before:hidden last:border-0"
                >
                  <Skeleton className="h-5 w-24 rounded-full" />
                </td>
                <td
                  data-title="Total Prospek"
                  className="flex items-center justify-between md:table-cell py-3 px-4 border-b border-border/50 md:border-0 before:content-[attr(data-title)] before:font-medium before:text-muted-foreground md:before:hidden last:border-0 md:text-center"
                >
                  <Skeleton className="h-5 w-16 rounded-full md:mx-auto" />
                </td>
                <td
                  data-title="Aksi"
                  className="flex items-center justify-between md:table-cell py-3 px-4 border-b border-border/50 md:border-0 before:content-[attr(data-title)] before:font-medium before:text-muted-foreground md:before:hidden last:border-0 md:text-right"
                >
                  <Skeleton className="h-7 w-16 rounded-md ml-auto" />
                </td>
              </tr>
            ))
          ) : clients.length === 0 ? (
            <tr className="block md:table-row">
              <td
                colSpan={5}
                className="py-12 text-center text-muted-foreground block md:table-cell"
              >
                <div className="flex flex-col items-center justify-center gap-2">
                  <Building2 className="size-8 text-muted-foreground/50" />
                  <span className="font-medium text-foreground">
                    Tidak ada data klien yang ditemukan
                  </span>
                  <span className="text-xs">
                    Coba sesuaikan kata kunci pencarian atau daftarkan klien
                    baru.
                  </span>
                </div>
              </td>
            </tr>
          ) : (
            clients.map((client) => {
              const dealsCount = client._count?.deals ?? 0;

              return (
                <tr
                  key={client.id}
                  className="hover:bg-muted/30 transition-colors block md:table-row mb-1.5 md:mb-0 border border-border md:border-transparent md:border-b-border last:md:border-b-transparent rounded-lg lg:rounded-xl md:rounded-none overflow-hidden bg-card md:bg-transparent shadow-2xs md:shadow-none"
                >
                  {/* Klien & Perusahaan */}
                  <td
                    data-title="Klien / PIC"
                    className="flex items-center justify-between md:table-cell py-3 px-4 border-b border-border/50 md:border-0 before:content-[attr(data-title)] before:font-medium before:text-muted-foreground md:before:hidden last:border-0"
                  >
                    <div className="flex flex-col items-end md:items-start text-right md:text-left">
                      <span className="font-semibold text-foreground text-sm">
                        {client.clientName}
                      </span>
                      <div className="flex items-center gap-1.5 text-muted-foreground mt-0.5 justify-end md:justify-start">
                        <Building2 className="size-3.5 shrink-0" />
                        <span className="font-medium text-xs">
                          {client.companyName}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Informasi Kontak */}
                  <td
                    data-title="Kontak"
                    className="flex items-center justify-between md:table-cell py-3 px-4 border-b border-border/50 md:border-0 before:content-[attr(data-title)] before:font-medium before:text-muted-foreground md:before:hidden last:border-0"
                  >
                    <div className="flex flex-col gap-1 items-end md:items-start text-right md:text-left">
                      <div className="flex items-center gap-1.5 text-foreground justify-end md:justify-start">
                        <Mail className="size-3 text-muted-foreground shrink-0 md:order-first order-last" />
                        <a
                          href={`mailto:${client.contactEmail}`}
                          className="hover:underline truncate max-w-37.5 sm:max-w-xs"
                        >
                          {client.contactEmail}
                        </a>
                      </div>
                      {client.contactPhone && (
                        <div className="flex items-center gap-1.5 text-muted-foreground justify-end md:justify-start">
                          <Phone className="size-3 shrink-0 md:order-first order-last" />
                          <span>{client.contactPhone}</span>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Sumber Prospek */}
                  <td
                    data-title="Sumber"
                    className="flex items-center justify-between md:table-cell py-3 px-4 border-b border-border/50 md:border-0 before:content-[attr(data-title)] before:font-medium before:text-muted-foreground md:before:hidden last:border-0"
                  >
                    {client.leadSource ? (
                      <Badge
                        variant="secondary"
                        className="font-normal text-[11px] rounded-full gap-1 py-0.5 px-2 bg-muted text-foreground border border-border"
                      >
                        <Tag className="size-2.5 text-muted-foreground" />
                        <span>{client.leadSource}</span>
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </td>

                  {/* Total Prospek */}
                  <td
                    data-title="Total Deal"
                    className="flex items-center justify-between md:table-cell py-3 px-4 border-b border-border/50 md:border-0 before:content-[attr(data-title)] before:font-medium before:text-muted-foreground md:before:hidden last:border-0 md:text-center"
                  >
                    <Badge
                      variant={dealsCount > 0 ? "outline" : "ghost"}
                      className={`text-xs rounded-full gap-1 px-2.5 py-0.5 font-medium ${
                        dealsCount > 0
                          ? "bg-primary/5 text-primary border-primary/20"
                          : "text-muted-foreground opacity-70"
                      }`}
                    >
                      <Layers className="size-3" />
                      <span>{dealsCount} Deal</span>
                    </Badge>
                  </td>

                  {/* Aksi */}
                  <td
                    data-title="Aksi"
                    className="flex items-center justify-between md:table-cell py-3 px-4 border-b border-border/50 md:border-0 before:content-[attr(data-title)] before:font-medium before:text-muted-foreground md:before:hidden last:border-0 md:text-right"
                  >
                    <div className="inline-flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(client)}
                        className="size-8 p-0 cursor-pointer text-muted-foreground hover:text-foreground bg-muted md:bg-transparent"
                        title="Edit Data Klien"
                      >
                        <Edit2 className="size-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(client)}
                        className="size-8 p-0 cursor-pointer text-muted-foreground hover:text-destructive bg-destructive/10 md:bg-transparent"
                        title="Hapus Klien"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
