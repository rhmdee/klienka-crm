export interface DashboardStatsData {
  activeDealsCount: number;
  totalDealsCount: number;
  activePipelineValue: number;
  closedWonCount: number;
  closedWonValue: number;
  totalHandoffs: number;
  assignedHandoffs: number;
  pendingHandoffs: number;
}

export interface RecentDealItem {
  id: string;
  title: string;
  stage: string;
  estimatedBudget: number | string;
  client: {
    clientName: string;
    companyName: string;
  };
  user?: {
    name: string;
  } | null;
  updatedAt: string;
}

export interface RecentHandoffItem {
  id: string;
  dealId: string;
  dealTitle: string;
  companyName: string;
  assignedOperator: string;
  briefNotes?: string | null;
  updatedAt: string;
}

export function formatIDR(amount: number | string): string {
  const num = typeof amount === "string" ? parseInt(amount, 10) || 0 : amount;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(num);
}

export function getStageBadge(stage: string): { label: string; className: string } {
  switch (stage) {
    case "INQUIRY":
      return { label: "Inquiry", className: "bg-muted text-foreground border-border" };
    case "DISCOVERY_CALL":
      return { label: "Discovery", className: "bg-primary/10 text-primary border-primary/20" };
    case "SOW_ESTIMATION":
      return { label: "SOW Estimation", className: "bg-info/10 text-info border-info/20" };
    case "NEGOTIATION":
      return { label: "Negotiation", className: "bg-warning/10 text-warning border-warning/20" };
    case "CLOSED_WON":
      return { label: "Closed Won", className: "bg-success/15 text-success border-success/30" };
    case "CLOSED_LOST":
      return { label: "Closed Lost", className: "bg-destructive/10 text-destructive border-destructive/20" };
    default:
      return { label: stage, className: "bg-muted text-muted-foreground border-border" };
  }
}
