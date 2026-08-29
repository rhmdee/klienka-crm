export interface SOWRoleItem {
  id: string;
  roleName: string;
  manDays: number;
  dailyRate: number;
  subtotal: number;
}

export interface DealOption {
  id: string;
  title: string;
  client: {
    clientName: string;
    companyName: string;
    contactEmail: string;
  };
  stage: string;
  estimatedBudget: number | string;
}

export interface SOWCalculationResult {
  baseCost: number;
  marginPercentage: number;
  marginAmount: number;
  totalCost: number;
}

export interface SOWGenerateResponse {
  id: string;
  dealId: string;
  version: number;
  status: string;
  totalCost: string | number;
  marginPercentage: number;
  magicLinkToken: string;
  tokenExpiresAt: string;
  items: Array<{
    id: string;
    roleName: string;
    manDays: number;
    dailyRate: string | number;
    subtotal: string | number;
  }>;
}

export const DEFAULT_TECHNICAL_ROLES: Omit<SOWRoleItem, "id" | "subtotal">[] = [
  {
    roleName: "UI/UX Designer",
    manDays: 5,
    dailyRate: 1500000,
  },
  {
    roleName: "Frontend Engineer",
    manDays: 10,
    dailyRate: 1800000,
  },
  {
    roleName: "Backend Engineer",
    manDays: 10,
    dailyRate: 2000000,
  },
  {
    roleName: "QA Engineer",
    manDays: 5,
    dailyRate: 1200000,
  },
];

export function formatIDR(value: number | bigint | string | null | undefined): string {
  if (value === null || value === undefined || value === "") return "Rp 0";
  const num = typeof value === "bigint" ? Number(value) : Number(value);
  if (isNaN(num)) return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(num);
}
