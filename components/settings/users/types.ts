export type RoleType =
  | "ADMINISTRATOR"
  | "BUSINESS_DEVELOPMENT"
  | "PROJECT_MANAGER"
  | "OPERATIONAL_TEAM";

export interface UserItem {
  id: string;
  name: string;
  email: string;
  role: RoleType;
  createdAt: string;
  updatedAt: string;
  _count?: {
    deals: number;
  };
}

export interface RoleConfig {
  value: RoleType;
  label: string;
  description: string;
  badgeClass: string;
}

export const ROLES: RoleConfig[] = [
  {
    value: "ADMINISTRATOR",
    label: "Administrator",
    description: "Akses penuh ke seluruh modul, konfigurasi, dan pengguna.",
    badgeClass: "bg-destructive/10 text-destructive border-destructive/20",
  },
  {
    value: "BUSINESS_DEVELOPMENT",
    label: "Business Development",
    description: "Pengelolaan prospek, pipeline deals, dan estimasi SOW.",
    badgeClass: "bg-primary/10 text-primary border-primary/20",
  },
  {
    value: "PROJECT_MANAGER",
    label: "Project Manager",
    description: "Akses serah terima operasional dan penunjukan operator teknis.",
    badgeClass: "bg-info/10 text-info border-info/20",
  },
  {
    value: "OPERATIONAL_TEAM",
    label: "Operational Team",
    description: "Visibilitas spesifikasi teknis deal dan brief proyek.",
    badgeClass: "bg-warning/15 text-warning border-warning/30",
  },
];

export function getRoleConfig(role: string): RoleConfig {
  const found = ROLES.find((r) => r.value === role);
  if (found) return found;
  return {
    value: role as RoleType,
    label: role,
    description: "Peran pengguna",
    badgeClass: "bg-muted text-muted-foreground border-border",
  };
}

export function formatDate(dateString: string): string {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  } catch {
    return dateString;
  }
}
