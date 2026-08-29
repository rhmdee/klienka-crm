"use client";

import { Edit2, Sliders, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
    <Card className="border-border bg-card overflow-hidden shadow-xs p-0">
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-muted-foreground font-medium">
              <th className="py-3 px-4 w-1/4">Kunci Parameter (Key)</th>
              <th className="py-3 px-4 w-1/3">Nilai (Value)</th>
              <th className="py-3 px-4">Deskripsi</th>
              <th className="py-3 px-4 text-right w-24">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="py-3.5 px-4">
                    <Skeleton className="h-5 w-36 rounded-md" />
                  </td>
                  <td className="py-3.5 px-4">
                    <Skeleton className="h-4 w-44 rounded-md" />
                  </td>
                  <td className="py-3.5 px-4">
                    <Skeleton className="h-4 w-52 rounded-md" />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Skeleton className="h-7 w-16 rounded-md ml-auto" />
                  </td>
                </tr>
              ))
            ) : params.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="py-12 text-center text-muted-foreground"
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
                  className="hover:bg-muted/30 transition-colors"
                >
                  {/* Kunci Parameter */}
                  <td className="py-3.5 px-4 font-mono font-semibold text-foreground">
                    <span className="inline-block px-2 py-0.5 rounded-md bg-muted text-foreground border border-border text-[11px]">
                      {param.paramKey}
                    </span>
                  </td>

                  {/* Nilai */}
                  <td className="py-3.5 px-4 text-foreground font-medium break-all">
                    {param.paramValue}
                  </td>

                  {/* Deskripsi */}
                  <td className="py-3.5 px-4 text-muted-foreground">
                    {param.description || "-"}
                  </td>

                  {/* Aksi */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="inline-flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(param)}
                        className="size-8 p-0 cursor-pointer text-muted-foreground hover:text-foreground"
                        title="Edit Parameter"
                      >
                        <Edit2 className="size-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(param)}
                        className="size-8 p-0 cursor-pointer text-muted-foreground hover:text-destructive"
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
    </Card>
  );
}
