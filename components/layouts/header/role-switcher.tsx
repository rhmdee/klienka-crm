"use client";

import {
  ShieldAlert,
  Briefcase,
  Kanban,
  Wrench,
  Check,
  ChevronDown,
  UserCheck,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useUserRole, RoleType, ROLE_LABELS } from "@/hooks/use-user-role";
import { toast } from "@/components/ui/sonner";

interface RoleOption {
  role: RoleType;
  title: string;
  desc: string;
  icon: typeof ShieldAlert;
  color: string;
}

const ROLES: RoleOption[] = [
  {
    role: "ADMINISTRATOR",
    title: "Administrator",
    desc: "Akses penuh, override SOW & konfigurasi sistem",
    icon: ShieldAlert,
    color: "text-red-500",
  },
  {
    role: "BUSINESS_DEVELOPMENT",
    title: "Business Development",
    desc: "Akses Pipeline, SOW Estimator & Database Klien",
    icon: Briefcase,
    color: "text-blue-500",
  },
  {
    role: "PROJECT_MANAGER",
    title: "Project Manager",
    desc: "Akses Pipeline (Read-Only) & Distribusi Handoff",
    icon: Kanban,
    color: "text-amber-500",
  },
  {
    role: "OPERATIONAL_TEAM",
    title: "Operational Team",
    desc: "Akses Dashboard & Tugas Teknis Handoff",
    icon: Wrench,
    color: "text-emerald-500",
  },
];

export function RoleSwitcher({ className }: { className?: string }) {
  const {
    activeRole,
    roleLabel,
    simulatedRole,
    setSimulatedRole,
    currentUser,
  } = useUserRole();

  const handleSelectRole = (role: RoleType) => {
    setSimulatedRole(role);
    toast.success(
      `Beralih simulasi peran ke ${ROLE_LABELS[role]}. Hak akses modul telah disesuaikan.`,
    );
  };

  const handleReset = () => {
    setSimulatedRole(null);
    toast.info("Simulasi peran dinonaktifkan. Mengikuti sesi asli pengguna.");
  };

  const currentOption = ROLES.find((r) => r.role === activeRole) || ROLES[0];
  const CurrentIcon = currentOption.icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-border bg-card hover:bg-muted/60 transition-all text-xs font-medium cursor-pointer outline-none shadow-2xs ${className || ""}`}
      >
        <CurrentIcon className={`size-3.5 ${currentOption.color} shrink-0`} />
        <span className="hidden sm:inline text-muted-foreground text-[11px]">
          Role:
        </span>
        <span className="font-semibold text-foreground max-w-30 truncate">
          {roleLabel}
        </span>
        {simulatedRole && (
          <Badge
            variant="outline"
            className="text-[9px] px-1 py-0 h-4 bg-primary/10 text-primary border-primary/20 hidden md:inline-flex"
          >
            SIMULASI
          </Badge>
        )}
        <ChevronDown className="size-3 text-muted-foreground shrink-0 ml-0.5" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-72 p-1.5 bg-background border border-border"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-2 py-1.5 flex flex-col gap-0.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground">
                Simulator Hak Akses (RBAC)
              </span>
              <span className="text-[10px] text-muted-foreground font-mono">
                Epic 5
              </span>
            </div>
            <span className="text-[11px] font-normal text-muted-foreground leading-tight">
              Pilih peran di bawah ini untuk menguji pembatasan fitur dan menu
              secara langsung.
            </span>
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup className="space-y-0.5">
          {ROLES.map((item) => {
            const Icon = item.icon;
            const isSelected = activeRole === item.role;

            return (
              <DropdownMenuItem
                key={item.role}
                onClick={() => handleSelectRole(item.role)}
                className={`flex items-start gap-2.5 p-2 rounded-md cursor-pointer transition-colors ${
                  isSelected ? "bg-muted/80" : "hover:bg-muted/40"
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  <Icon className={`size-4 ${item.color}`} />
                </div>
                <div className="flex flex-col flex-1 gap-0.5 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground">
                      {item.title}
                    </span>
                    {isSelected && (
                      <Check className="size-3.5 text-primary shrink-0" />
                    )}
                  </div>
                  <span className="text-[11px] text-muted-foreground leading-tight">
                    {item.desc}
                  </span>
                </div>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuGroup>

        {simulatedRole && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleReset}
              className="flex items-center gap-2 p-2 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <UserCheck className="size-3.5 text-muted-foreground" />
              <span>
                Kembalikan ke Sesi Asli ({currentUser?.role || "Default"})
              </span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
