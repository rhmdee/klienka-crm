"use client";

import { Edit2, Mail, Trash2, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate, getRoleConfig, UserItem } from "./types";

interface UserTableProps {
  users: UserItem[];
  isLoading?: boolean;
  onEdit: (user: UserItem) => void;
  onDelete: (user: UserItem) => void;
}

export function UserTable({
  users,
  isLoading = false,
  onEdit,
  onDelete,
}: UserTableProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full text-xs text-left border-collapse">
        <thead>
            <tr className="border-b border-border bg-muted/40 text-muted-foreground font-medium">
              <th className="py-3 px-4">Pengguna</th>
              <th className="py-3 px-4">Peran / Hak Akses</th>
              <th className="py-3 px-4 text-center">Tanggung Jawab Deals</th>
              <th className="py-3 px-4">Terdaftar Sejak</th>
              <th className="py-3 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <Skeleton className="size-8 rounded-full" />
                      <div className="flex flex-col gap-1">
                        <Skeleton className="h-4 w-36 rounded-md" />
                        <Skeleton className="h-3 w-28 rounded-md" />
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <Skeleton className="h-5 w-28 rounded-full" />
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <Skeleton className="h-5 w-16 rounded-full mx-auto" />
                  </td>
                  <td className="py-3.5 px-4">
                    <Skeleton className="h-4 w-24 rounded-md" />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Skeleton className="h-7 w-16 rounded-md ml-auto" />
                  </td>
                </tr>
              ))
            ) : users.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="py-12 text-center text-muted-foreground"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Users className="size-8 text-muted-foreground/50" />
                    <span className="font-medium text-foreground">
                      Tidak ada data pengguna yang ditemukan
                    </span>
                    <span className="text-xs">
                      Coba sesuaikan kata kunci pencarian atau filter peran.
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              users.map((user) => {
                const roleConfig = getRoleConfig(user.role);
                const dealCount = user._count?.deals || 0;

                return (
                  <tr
                    key={user.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    {/* Nama & Email */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs shrink-0 border border-primary/20">
                          {getInitials(user.name)}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-foreground text-sm">
                            {user.name}
                          </span>
                          <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                            <Mail className="size-3" />
                            <span>{user.email}</span>
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Peran / Role */}
                    <td className="py-3.5 px-4">
                      <Badge
                        variant="outline"
                        className={`gap-1 px-2.5 py-0.5 text-[10px] font-semibold ${roleConfig.badgeClass}`}
                      >
                        {roleConfig.label}
                      </Badge>
                    </td>

                    {/* Deals Count */}
                    <td className="py-3.5 px-4 text-center">
                      <Badge
                        variant="secondary"
                        className="px-2 py-0.5 text-xs font-semibold"
                      >
                        {dealCount} Deals
                      </Badge>
                    </td>

                    {/* Tanggal Terdaftar */}
                    <td className="py-3.5 px-4 text-muted-foreground">
                      {formatDate(user.createdAt)}
                    </td>

                    {/* Aksi */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(user)}
                          className="size-8 p-0 cursor-pointer text-muted-foreground hover:text-foreground"
                          title="Edit Pengguna"
                        >
                          <Edit2 className="size-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(user)}
                          className="size-8 p-0 cursor-pointer text-muted-foreground hover:text-destructive"
                          title="Hapus Pengguna"
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
