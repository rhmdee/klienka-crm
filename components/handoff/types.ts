export interface HandoffItem {
  id: string;
  dealId: string;
  assignedOperator: string;
  briefNotes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SOWRoleDetail {
  id: string;
  roleName: string;
  manDays: number;
  dailyRate: string | number;
  subtotal: string | number;
}

export interface SOWDetail {
  id: string;
  version: number;
  status: string;
  totalCost: string | number;
  marginPercentage: number;
  items: SOWRoleDetail[];
  createdAt: string;
}

export interface HandoffDealItem {
  id: string;
  title: string;
  description?: string | null;
  stage: string;
  estimatedBudget: string | number;
  techStack: string[];
  client: {
    id: string;
    clientName: string;
    companyName: string;
    contactEmail: string;
    contactPhone?: string | null;
  };
  user?: {
    id: string;
    name: string;
    email?: string;
    role?: string;
  } | null;
  handoff?: HandoffItem | null;
  sows?: SOWDetail[];
  createdAt: string;
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
