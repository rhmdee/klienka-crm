export type DealStage =
  | "INQUIRY"
  | "DISCOVERY_CALL"
  | "SOW_ESTIMATION"
  | "NEGOTIATION"
  | "CLOSED_WON"
  | "CLOSED_LOST";

export type ActivityType =
  | "EMAIL"
  | "CALL"
  | "MEETING"
  | "NOTE"
  | "STAGE_CHANGE";

export interface DealActivityItem {
  id: string;
  dealId?: string;
  type: ActivityType;
  title: string;
  description: string;
  actorName: string;
  createdAt: string;
  updatedAt?: string;
}

export interface DealItem {
  id: string;
  title: string;
  description?: string | null;
  stage: DealStage;
  estimatedBudget: number | string;
  techStack: string[];
  lossReason?: string | null;
  client: {
    id: string;
    clientName: string;
    companyName: string;
    contactEmail: string;
    contactPhone?: string | null;
    leadSource?: string | null;
  };
  user?: {
    id: string;
    name: string;
    email?: string;
    role?: string;
  };
  activities?: DealActivityItem[];
  sows?: Array<{
    id: string;
    title?: string;
    version: number;
    status: string;
    totalCost: number | string;
    marginPercentage?: number;
    magicLinkToken?: string | null;
    tokenExpiresAt?: string | null;
  }>;
  createdAt: string;
  updatedAt?: string;
}

export interface StageConfig {
  key: DealStage;
  label: string;
  description: string;
  badgeVariant: "default" | "secondary" | "outline" | "destructive";
  badgeColor?: string;
}

export const STAGES: StageConfig[] = [
  {
    key: "INQUIRY",
    label: "Inquiry",
    description: "Prospek baru masuk",
    badgeVariant: "outline",
    badgeColor: "bg-muted text-foreground",
  },
  {
    key: "DISCOVERY_CALL",
    label: "Discovery Call",
    description: "Kualifikasi kebutuhan",
    badgeVariant: "secondary",
    badgeColor: "bg-primary/10 text-primary",
  },
  {
    key: "SOW_ESTIMATION",
    label: "SOW & Estimation",
    description: "Penyusunan estimasi biaya",
    badgeVariant: "default",
    badgeColor: "bg-info/10 text-info",
  },
  {
    key: "NEGOTIATION",
    label: "Negotiation",
    description: "Tahap negosiasi kontrak",
    badgeVariant: "default",
    badgeColor: "bg-warning/10 text-warning",
  },
  {
    key: "CLOSED_WON",
    label: "Closed Won",
    description: "Deal berhasil didapatkan",
    badgeVariant: "secondary",
    badgeColor: "bg-success/10 text-success",
  },
  {
    key: "CLOSED_LOST",
    label: "Closed Lost",
    description: "Deal tidak berlanjut",
    badgeVariant: "destructive",
    badgeColor: "bg-destructive/10 text-destructive",
  },
];

export const STAGE_ORDER: DealStage[] = [
  "INQUIRY",
  "DISCOVERY_CALL",
  "SOW_ESTIMATION",
  "NEGOTIATION",
  "CLOSED_WON",
];

export function formatIDR(amount: number | string) {
  const numericAmount = typeof amount === "string" ? Number(amount) : amount;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(numericAmount || 0);
}
