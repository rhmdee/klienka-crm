"use client";

import { Plus, Trash2, Code2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SOWRoleItem, formatIDR } from "./types";

interface SOWEstimatorFormProps {
  items: SOWRoleItem[];
  onUpdateItem: (id: string, field: keyof SOWRoleItem, value: string | number) => void;
  onAddItem: () => void;
  onRemoveItem: (id: string) => void;
  disabled?: boolean;
}

export function SOWEstimatorForm({
  items,
  onUpdateItem,
  onAddItem,
  onRemoveItem,
  disabled = false,
}: SOWEstimatorFormProps) {
  const totalManDays = items.reduce((acc, curr) => acc + (Number(curr.manDays) || 0), 0);

  return (
    <Card className="p-4 sm:p-5 border-border bg-card flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <Code2 className="size-4" />
          </div>
          <div>
            <h2 className="font-semibold text-sm text-foreground">
              Estimasi Alokasi Peran Teknis & Man-Days
            </h2>
            <p className="text-xs text-muted-foreground">
              Tentukan kebutuhan hari kerja dan tarif standar untuk tiap peran teknis
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs px-2.5 py-1 gap-1 border-primary/30 text-primary bg-primary/5">
            <Calendar className="size-3" />
            <span>Total: {totalManDays} Man-Days</span>
          </Badge>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={onAddItem}
            disabled={disabled}
            className="text-xs gap-1 h-8 cursor-pointer"
          >
            <Plus className="size-3.5" />
            <span>Tambah Peran</span>
          </Button>
        </div>
      </div>

      {/* Role List */}
      <div className="flex flex-col gap-3">
        {items.map((item, index) => (
          <div
            key={item.id}
            className={`p-3.5 rounded-lg border border-border bg-background flex flex-col sm:flex-row items-start sm:items-center gap-3 transition-all ${
              disabled ? "opacity-75 bg-muted/20" : "hover:border-border/80"
            }`}
          >
            <div className="flex items-center gap-2 w-full sm:w-52 shrink-0">
              <span className="text-xs font-semibold text-muted-foreground size-5 rounded-full bg-muted flex items-center justify-center shrink-0">
                {index + 1}
              </span>
              <div className="flex-1">
                <label className="text-[10px] font-medium text-muted-foreground block mb-0.5">
                  Nama Peran
                </label>
                <Input
                  value={item.roleName}
                  disabled={disabled}
                  onChange={(e) => onUpdateItem(item.id, "roleName", e.target.value)}
                  placeholder="e.g. UI/UX Designer"
                  className="h-8 text-xs font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 gap-2.5 w-full sm:flex-1">
              <div>
                <label className="text-[10px] font-medium text-muted-foreground block mb-0.5">
                  Man-Days (Hari)
                </label>
                <div className="relative">
                  <Input
                    type="number"
                    min={1}
                    disabled={disabled}
                    value={item.manDays === 0 ? "" : item.manDays}
                    onChange={(e) => {
                      const val = Math.max(0, parseInt(e.target.value) || 0);
                      onUpdateItem(item.id, "manDays", val);
                    }}
                    placeholder="0"
                    className="h-8 text-xs pr-7"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground pointer-events-none">
                    MD
                  </span>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-medium text-muted-foreground block mb-0.5">
                  Daily Rate (Rp)
                </label>
                <Input
                  type="number"
                  min={0}
                  step={50000}
                  disabled={disabled}
                  value={item.dailyRate === 0 ? "" : item.dailyRate}
                  onChange={(e) => {
                    const val = Math.max(0, parseInt(e.target.value) || 0);
                    onUpdateItem(item.id, "dailyRate", val);
                  }}
                  placeholder="0"
                  className="h-8 text-xs font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-44 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border">
              <div className="flex flex-col sm:text-right">
                <span className="text-[10px] text-muted-foreground">Subtotal</span>
                <span className="text-xs font-semibold text-foreground">
                  {formatIDR(item.subtotal)}
                </span>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                disabled={disabled || items.length <= 1}
                onClick={() => onRemoveItem(item.id)}
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer disabled:opacity-30"
                title="Hapus baris"
              >
                <Trash2 className="size-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="text-center py-8 text-xs text-muted-foreground italic border border-dashed border-border rounded-lg">
          Belum ada peran teknis yang ditambahkan. Klik &quot;Tambah Peran&quot; untuk memulai.
        </div>
      )}
    </Card>
  );
}
