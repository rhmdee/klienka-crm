"use client";

import { Building2, User, Mail, Phone, Tag } from "lucide-react";
import { Card } from "@/components/ui/card";
import { DealItem } from "../types";

interface DealDetailClientCardProps {
  deal: DealItem;
}

export function DealDetailClientCard({ deal }: DealDetailClientCardProps) {
  return (
    <Card className="p-4 border-border bg-card flex flex-col gap-3">
      <div className="flex items-center gap-2 border-b border-border pb-2.5">
        <Building2 className="size-4 text-primary" />
        <h2 className="font-semibold text-sm text-foreground">
          Informasi Kontak & Klien
        </h2>
      </div>

      <div className="flex flex-col gap-3 text-xs">
        {/* Company Name */}
        <div className="flex items-start gap-2.5">
          <Building2 className="size-4 text-muted-foreground shrink-0 mt-0.5" />
          <div className="flex flex-col">
            <span className="text-muted-foreground">Perusahaan</span>
            <span className="font-medium text-foreground">
              {deal.client.companyName}
            </span>
          </div>
        </div>

        {/* Contact Person */}
        <div className="flex items-start gap-2.5">
          <User className="size-4 text-muted-foreground shrink-0 mt-0.5" />
          <div className="flex flex-col">
            <span className="text-muted-foreground">Kontak Person</span>
            <span className="font-medium text-foreground">
              {deal.client.clientName}
            </span>
          </div>
        </div>

        {/* Email */}
        <div className="flex items-start gap-2.5">
          <Mail className="size-4 text-muted-foreground shrink-0 mt-0.5" />
          <div className="flex flex-col">
            <span className="text-muted-foreground">Email</span>
            <a
              href={`mailto:${deal.client.contactEmail}`}
              className="font-medium text-primary hover:underline"
            >
              {deal.client.contactEmail}
            </a>
          </div>
        </div>

        {/* Phone */}
        <div className="flex items-start gap-2.5">
          <Phone className="size-4 text-muted-foreground shrink-0 mt-0.5" />
          <div className="flex flex-col">
            <span className="text-muted-foreground">No. Telepon / WA</span>
            <span className="font-medium text-foreground">
              {deal.client.contactPhone ? (
                <a
                  href={`https://wa.me/${deal.client.contactPhone.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary hover:underline"
                >
                  {deal.client.contactPhone}
                </a>
              ) : (
                <span className="text-muted-foreground italic">
                  Belum ditambahkan
                </span>
              )}
            </span>
          </div>
        </div>

        {/* Lead Source */}
        <div className="flex items-start gap-2.5">
          <Tag className="size-4 text-muted-foreground shrink-0 mt-0.5" />
          <div className="flex flex-col">
            <span className="text-muted-foreground">Sumber Prospek</span>
            <span className="font-medium text-foreground">
              {deal.client.leadSource || "Website Inbound"}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
