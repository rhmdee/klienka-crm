"use client";

import { useAppStore } from "@/stores/useAppStore";

export type RoleType =
  | "ADMINISTRATOR"
  | "BUSINESS_DEVELOPMENT"
  | "PROJECT_MANAGER"
  | "OPERATIONAL_TEAM";

export const ROLE_LABELS: Record<RoleType, string> = {
  ADMINISTRATOR: "Administrator",
  BUSINESS_DEVELOPMENT: "Business Development",
  PROJECT_MANAGER: "Project Manager",
  OPERATIONAL_TEAM: "Operational Team",
};

export const ROLE_BADGE_COLORS: Record<RoleType, string> = {
  ADMINISTRATOR: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  BUSINESS_DEVELOPMENT: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  PROJECT_MANAGER: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  OPERATIONAL_TEAM: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
};

export function useUserRole() {
  const currentUser = useAppStore((state) => state.currentUser);
  const simulatedRole = useAppStore((state) => state.simulatedRole);
  const setSimulatedRole = useAppStore((state) => state.setSimulatedRole);

  const activeRole = (simulatedRole || currentUser?.role || "ADMINISTRATOR") as RoleType;

  const isAdmin = activeRole === "ADMINISTRATOR";
  const isBD = activeRole === "BUSINESS_DEVELOPMENT";
  const isPM = activeRole === "PROJECT_MANAGER";
  const isOps = activeRole === "OPERATIONAL_TEAM";

  // Permissions Matrix
  const canAccessPipeline = isAdmin || isBD || isPM;
  const canManagePipeline = isAdmin || isBD; // PM can view, but cannot drag/create/edit
  const canCreateLead = isAdmin || isBD;
  const canManageSOW = isAdmin || isBD;
  const canAdminOverrideSOW = isAdmin;

  const canAccessClients = isAdmin || isBD;
  const canManageClients = isAdmin || isBD;
  const canDeleteClients = isAdmin;

  const canAccessHandoff = isAdmin || isPM || isOps;
  const canAssignHandoff = isAdmin || isPM;

  const canAccessSettings = isAdmin;

  return {
    activeRole,
    roleLabel: ROLE_LABELS[activeRole] || activeRole,
    badgeColor: ROLE_BADGE_COLORS[activeRole] || "bg-muted text-muted-foreground",
    simulatedRole,
    setSimulatedRole,
    currentUser,

    // Role checks
    isAdmin,
    isBD,
    isPM,
    isOps,

    // Module Permissions
    canAccessPipeline,
    canManagePipeline,
    canCreateLead,
    canManageSOW,
    canAdminOverrideSOW,

    canAccessClients,
    canManageClients,
    canDeleteClients,

    canAccessHandoff,
    canAssignHandoff,

    canAccessSettings,
  };
}
