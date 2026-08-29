"use client";

import { MenuItem, type MenuItemProps } from "./menu-item";
import { useUserRole, RoleType } from "@/hooks/use-user-role";

interface NavigationItem extends MenuItemProps {
  allowedRoles: RoleType[];
}

const menuItems: NavigationItem[] = [
  {
    href: "/dashboard",
    icon: "LayoutDashboard",
    label: "Dashboard",
    allowedRoles: [
      "ADMINISTRATOR",
      "BUSINESS_DEVELOPMENT",
      "PROJECT_MANAGER",
      "OPERATIONAL_TEAM",
    ],
  },
  {
    href: "/pipeline",
    icon: "Activity",
    label: "Pipeline",
    allowedRoles: [
      "ADMINISTRATOR",
      "BUSINESS_DEVELOPMENT",
      "PROJECT_MANAGER",
    ],
  },
  {
    href: "/clients",
    icon: "Building2",
    label: "Database Klien",
    allowedRoles: ["ADMINISTRATOR", "BUSINESS_DEVELOPMENT"],
  },
  {
    href: "/handoff",
    icon: "FileCheck",
    label: "Handoff",
    allowedRoles: ["ADMINISTRATOR", "PROJECT_MANAGER", "OPERATIONAL_TEAM"],
  },
  {
    href: "/settings/users",
    icon: "Users",
    label: "User Management",
    allowedRoles: ["ADMINISTRATOR"],
  },
  {
    href: "/settings/general-params",
    icon: "SlidersHorizontal",
    label: "Parameter Sistem",
    allowedRoles: ["ADMINISTRATOR"],
  },
];

export const Navigation = () => {
  const { activeRole } = useUserRole();

  const filteredMenuItems = menuItems.filter((item) =>
    item.allowedRoles.includes(activeRole),
  );

  return (
    <nav className="px-2 py-4 flex-1">
      <ul className="w-full space-y-1">
        {filteredMenuItems.map((item) => (
          <MenuItem key={item.href} {...item} />
        ))}
      </ul>
    </nav>
  );
};

