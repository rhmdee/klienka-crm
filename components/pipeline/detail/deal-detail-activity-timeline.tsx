"use client";

import { useState, useMemo, type FormEvent } from "react";
import {
  History,
  MessageSquare,
  Mail,
  Phone,
  Calendar,
  Send,
  Loader2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ActivityType, DealActivityItem } from "../types";

interface DealDetailActivityTimelineProps {
  activities: DealActivityItem[];
  onAddActivity: (type: ActivityType, text: string) => Promise<void>;
  isAddingActivity: boolean;
}

export function DealDetailActivityTimeline({
  activities,
  onAddActivity,
  isAddingActivity,
}: DealDetailActivityTimelineProps) {
  const [activeTab, setActiveTab] = useState<string>("ALL");
  const [newActivityType, setNewActivityType] = useState<ActivityType>("NOTE");
  const [newActivityText, setNewActivityText] = useState("");

  const filteredActivities = useMemo(() => {
    if (activeTab === "ALL") return activities;
    return activities.filter((act) => act.type === activeTab);
  }, [activities, activeTab]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!newActivityText.trim() || isAddingActivity) return;
    await onAddActivity(newActivityType, newActivityText.trim());
    setNewActivityText("");
  };

  return (
    <Card className="p-4 border-border bg-card flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-2.5">
        <div className="flex items-center gap-2">
          <History className="size-4 text-primary" />
          <h2 className="font-semibold text-sm text-foreground">
            Riwayat Aktivitas & Catatan Interaksi
          </h2>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 bg-muted/60 p-0.5 rounded-lg text-xs self-start sm:self-auto overflow-x-auto">
          {[
            { key: "ALL", label: "Semua" },
            { key: "NOTE", label: "Catatan" },
            { key: "EMAIL", label: "Email" },
            { key: "CALL", label: "Panggilan" },
            { key: "MEETING", label: "Rapat" },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`px-2 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                activeTab === tab.key
                  ? "bg-background text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Add Activity Box */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-2 p-3 bg-muted/30 border border-border rounded-xl"
      >
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className="text-xs font-semibold text-foreground">
            Tambah Catatan / Log Aktivitas:
          </span>
          <div className="flex items-center gap-1.5">
            {[
              { type: "NOTE" as const, label: "Catatan", icon: MessageSquare },
              { type: "EMAIL" as const, label: "Email", icon: Mail },
              { type: "CALL" as const, label: "Telepon", icon: Phone },
              { type: "MEETING" as const, label: "Rapat", icon: Calendar },
            ].map((btn) => {
              const Icon = btn.icon;
              return (
                <button
                  key={btn.type}
                  type="button"
                  onClick={() => setNewActivityType(btn.type)}
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors cursor-pointer ${
                    newActivityType === btn.type
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "bg-background border border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="size-3" />
                  <span>{btn.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-2 items-start mt-1">
          <textarea
            rows={2}
            value={newActivityText}
            onChange={(e) => setNewActivityText(e.target.value)}
            placeholder={`Tulis rincian ${newActivityType.toLowerCase()} interaksi dengan klien...`}
            className="flex-1 w-full text-xs p-2 rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary resize-none transition-colors"
          />
          <Button
            type="submit"
            size="sm"
            disabled={!newActivityText.trim() || isAddingActivity}
            className="cursor-pointer shrink-0"
          >
            {isAddingActivity ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Send className="size-3.5" />
            )}
            <span className="hidden sm:inline">Kirim</span>
          </Button>
        </div>
      </form>

      {/* Activity Timeline List */}
      <div className="flex flex-col gap-3 relative before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-border/60">
        {filteredActivities.length === 0 ? (
          <div className="text-center py-6 text-xs text-muted-foreground italic">
            Belum ada catatan aktivitas untuk filter ini.
          </div>
        ) : (
          filteredActivities.map((act) => {
            const formattedDate = new Date(act.createdAt).toLocaleDateString(
              "id-ID",
              {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              },
            );

            let Icon = MessageSquare;
            let iconColor =
              "bg-primary text-primary-foreground border-primary/20";
            if (act.type === "EMAIL") {
              Icon = Mail;
              iconColor = "bg-info text-primary-foreground border-info/20";
            } else if (act.type === "CALL") {
              Icon = Phone;
              iconColor =
                "bg-success text-primary-foreground border-success/20";
            } else if (act.type === "MEETING") {
              Icon = Calendar;
              iconColor =
                "bg-warning text-primary-foreground border-warning/20";
            }

            return (
              <div
                key={act.id}
                className="flex items-start gap-3 relative z-10"
              >
                <div
                  className={`size-7 rounded-full border flex items-center justify-center shrink-0 bg-background shadow-2xs ${iconColor}`}
                >
                  <Icon className="size-3.5" />
                </div>
                <div className="flex-1 bg-background border border-border p-3 rounded-xl shadow-xs flex flex-col gap-1">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="font-semibold text-xs text-foreground">
                      {act.title}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {formattedDate}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-normal">
                    {act.description}
                  </p>
                  <div className="text-[10px] text-muted-foreground/80 mt-1">
                    Oleh: {act.actorName}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
}
