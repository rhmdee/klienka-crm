export interface ClientItem {
  id: string;
  clientName: string;
  companyName: string;
  contactEmail: string;
  contactPhone: string | null;
  leadSource: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  _count?: {
    deals: number;
  };
}

export const LEAD_SOURCE_OPTIONS = [
  "Website Inbound",
  "Referral / Relasi",
  "LinkedIn Outreach",
  "Instagram",
  "WhatsApp Direct",
  "Event / Pameran",
  "Cold Outreach",
  "Lainnya",
];
