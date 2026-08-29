"use client";

import { Edit2, Sliders, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { GeneralParamItem } from "./types";

interface ParamsTableProps {
  params: GeneralParamItem[];
  isLoading?: boolean;
  onEdit: (param: GeneralParamItem) => void;
  onDelete: (param: GeneralParamItem) => void;
}

export function ParamsTable({
  params,
  isLoading = false,
  onEdit,
  onDelete,
}: ParamsTableProps) {
  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full text-xs text-left border-collapse block md:table">
        <thead className="hidden md:table-header-group">
            <tr className="border-b border-border bg-muted/40 text-muted-foreground font-medium">
              <th className="py-3 px-4 w-1/4">Kunci Parameter (Key)</th>
              <th className="py-3 px-4 w-1/3">Nilai (Value)</th>
              <th className="py-3 px-4">Deskripsi</th>
              <th className="py-3 px-4 text-right w-24">Aksi</th>
            </tr>
          </thead>
          <tbody className="block p-1.5 lg:p-0 md:table-row-group divide-y md:divide-border md:divide-y">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i} className="animate-pulse block md:table-row mb-1.5 md:mb-0 border border-border rounded-lg lg:rounded-xl md:rounded-none overflow-hidden bg-card md:bg-transparent">
                  <td data-title="Kunci Parameter" className="flex items-center justify-between md:table-cell py-3 px-4 border-b border-border/50 md:border-0 before:content-[attr(data-title)] before:font-medium before:text-muted-foreground md:before:hidden last:border-0">
                    <Skeleton className="h-5 w-36 rounded-md" />
                  </td>
                  <td data-title="Nilai" className="flex items-center justify-between md:table-cell py-3 px-4 border-b border-border/50 md:border-0 before:content-[attr(data-title)] before:font-medium before:text-muted-foreground md:before:hidden last:border-0">
                    <Skeleton className="h-4 w-44 rounded-md" />
                  </td>
                  <td data-title="Deskripsi" className="flex items-center justify-between md:table-cell py-3 px-4 border-b border-border/50 md:border-0 before:content-[attr(data-title)] before:font-medium before:text-muted-foreground md:before:hidden last:border-0">
                    <Skeleton className="h-4 w-52 rounded-md" />
                  </td>
                  <td data-title="Aksi" className="flex items-center justify-between md:table-cell py-3 px-4 border-b border-border/50 md:border-0 before:content-[attr(data-title)] before:font-medium before:text-muted-foreground md:before:hidden last:border-0 md:text-right">
                    <Skeleton className="h-7 w-16 rounded-md ml-auto" />
                  </td>
                </tr>
              ))
            ) : params.length === 0 ? (
              <tr className="block md:table-row">
                <td
                  colSpan={4}
                  className="py-12 text-center text-muted-foreground block md:table-cell"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Sliders className="size-8 text-muted-foreground/50" />
                    <span className="font-medium text-foreground">
                      Tidak ada parameter sistem yang ditemukan
                    </span>
                    <span className="text-xs">
                      Coba sesuaikan kata kunci pencarian atau buat parameter baru.
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              params.map((param) => (
                <tr
                  key={param.id}
                  className="hover:bg-muted/30 transition-colors block md:table-row mb-1.5 md:mb-0 border border-border rounded-lg lg:rounded-xl md:rounded-none overflow-hidden bg-card md:bg-transparent shadow-2xs md:shadow-none"
                >
                  {/* Kunci Parameter */}
                  <td data-title="Kunci Parameter" className="flex items-center justify-between md:table-cell py-3 px-4 border-b border-border/50 md:border-0 before:content-[attr(data-title)] before:font-medium before:text-muted-foreground md:before:hidden last:border-0 font-mono font-semibold text-foreground">
                    <span className="inline-block px-2 py-0.5 rounded-md bg-muted text-foreground border border-border text-[11px]">
                      {param.paramKey}
                    </span>
                  </td>

                  {/* Nilai */}
                  <td data-title="Nilai" className="flex items-center justify-between md:table-cell py-3 px-4 border-b border-border/50 md:border-0 before:content-[attr(data-title)] before:font-medium before:text-muted-foreground md:before:hidden last:border-0 text-foreground font-medium break-all text-right md:text-left">
                    {param.paramValue}
                  </td>

                  {/* Deskripsi */}
                  <td data-title="Deskripsi" className="flex items-center justify-between md:table-cell py-3 px-4 border-b border-border/50 md:border-0 before:content-[attr(data-title)] before:font-medium before:text-muted-foreground md:before:hidden last:border-0 text-muted-foreground text-right md:text-left">
                    {param.description || "-"}
                  </td>

                  {/* Aksi */}
                  <td data-title="Aksi" className="flex items-center justify-between md:table-cell py-3 px-4 border-b border-border/50 md:border-0 before:content-[attr(data-title)] before:font-medium before:text-muted-foreground md:before:hidden last:border-0 md:text-right">
                    <div className="inline-flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(param)}
                        className="size-8 p-0 cursor-pointer text-muted-foreground hover:text-foreground bg-muted md:bg-transparent"
                        title="Edit Parameter"
                      >
                        <Edit2 className="size-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(param)}
                        className="size-8 p-0 cursor-pointer text-muted-foreground hover:text-destructive bg-destructive/10 md:bg-transparent"
                        title="Hapus Parameter"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
    </div>
  );
}
