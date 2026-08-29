"use client";

import { UserCheck, CheckCircle2, Clock, ChevronDown, Loader2, Save } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HandoffItem } from "./types";

interface HandoffAssignmentCardProps {
  handoff: HandoffItem | null;
  availableOperators: string[];
  selectedOperator: string;
  onSelectedOperatorChange: (op: string) => void;
  briefNotes: string;
  onBriefNotesChange: (notes: string) => void;
  onSave: (e: React.FormEvent) => void;
  isSaving: boolean;
}

export function HandoffAssignmentCard({
  handoff,
  availableOperators,
  selectedOperator,
  onSelectedOperatorChange,
  briefNotes,
  onBriefNotesChange,
  onSave,
  isSaving,
}: HandoffAssignmentCardProps) {
  const isAssigned =
    handoff?.assignedOperator &&
    handoff.assignedOperator !== "PENDING_ASSIGNMENT";

  return (
    <Card className="p-4 sm:p-5 border-border bg-card flex flex-col gap-4 shadow-xs">
      <div className="flex items-center gap-2 border-b border-border pb-3">
        <div className="size-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
          <UserCheck className="size-4" />
        </div>
        <div>
          <h2 className="font-semibold text-sm text-foreground">
            Penugasan Operator Teknis
          </h2>
          <p className="text-[11px] text-muted-foreground">
            Penunjukan PIC pelaksana operasional (Epic 4: US-402)
          </p>
        </div>
      </div>

      {/* Status Current Assignment */}
      <div className="p-3 rounded-lg bg-muted/30 border border-border flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Status Penugasan:</span>
        {isAssigned ? (
          <Badge
            variant="outline"
            className="bg-success/10 text-success border-success/30 gap-1 text-[11px] font-medium"
          >
            <CheckCircle2 className="size-3" />
            <span>Ditugaskan</span>
          </Badge>
        ) : (
          <Badge
            variant="outline"
            className="bg-warning/10 text-warning border-warning/30 gap-1 text-[11px] font-medium"
          >
            <Clock className="size-3" />
            <span>Pending</span>
          </Badge>
        )}
      </div>

      <form onSubmit={onSave} className="flex flex-col gap-4 text-xs">
        {/* Dropdown Operator Selection (BR-DAT-01 & BR-DAT-02) */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-foreground">
            Pilih Penanggung Jawab Operasional *
          </label>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex h-9 w-full items-center justify-between rounded-lg border border-border bg-background px-3 py-1 text-xs text-foreground hover:bg-muted/50 transition-colors cursor-pointer">
              <span className="truncate">
                {selectedOperator || "Pilih Nama Operator"}
              </span>
              <ChevronDown className="size-3.5 text-muted-foreground shrink-0" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-64 bg-background border border-border"
            >
              {availableOperators.map((op) => (
                <DropdownMenuItem
                  key={op}
                  onClick={() => onSelectedOperatorChange(op)}
                  className="text-xs py-2 cursor-pointer font-medium"
                >
                  {op}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <span className="text-[10px] text-muted-foreground">
            Nama operator disimpan murni sebagai string parameter tanpa FK
            constraint (BR-DAT-01).
          </span>
        </div>

        {/* Brief Notes Textarea */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-foreground">
            Catatan Instruksi Handoff (Brief Notes)
          </label>
          <textarea
            rows={4}
            value={briefNotes}
            onChange={(e) => onBriefNotesChange(e.target.value)}
            placeholder="Masukkan catatan kick-off, link repository, instruksi khusus untuk tim developer..."
            className="w-full text-xs p-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors resize-none"
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSaving || !selectedOperator}
          className="w-full h-9 text-xs font-semibold gap-1.5 cursor-pointer shadow-xs"
        >
          {isSaving ? (
            <>
              <Loader2 className="size-3.5 animate-spin" />
              <span>Menyimpan Penugasan...</span>
            </>
          ) : (
            <>
              <Save className="size-3.5" />
              <span>Simpan Penugasan Operator</span>
            </>
          )}
        </Button>
      </form>
    </Card>
  );
}
