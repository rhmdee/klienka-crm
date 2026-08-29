"use client";

import { MenuItem, type MenuItemProps } from "./menu-item";
import { useUserRole, RoleType } from "@/hooks/use-user-role";
import { useAppStore } from "@/stores/useAppStore";

interface NavigationItem extends MenuItemProps {
  allowedRoles: RoleType[];
}

const mainflowItems: NavigationItem[] = [
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
    label: "Clients & Leads",
    allowedRoles: ["ADMINISTRATOR", "BUSINESS_DEVELOPMENT"],
  },
  {
    href: "/handoff",
    icon: "FileCheck",
    label: "Handoff",
    allowedRoles: ["ADMINISTRATOR", "PROJECT_MANAGER", "OPERATIONAL_TEAM"],
  },
];

const settingItems: NavigationItem[] = [
  {
    href: "/users",
    icon: "Users",
    label: "User Management",
    allowedRoles: ["ADMINISTRATOR"],
  },
  {
    href: "/general-params",
    icon: "SlidersHorizontal",
    label: "General Parameter",
    allowedRoles: ["ADMINISTRATOR"],
  },
];

export const Navigation = () => {
  const { activeRole } = useUserRole();
  const { isSidebarExpand } = useAppStore();

  const filteredMainflow = mainflowItems.filter((item) =>
    item.allowedRoles.includes(activeRole),
  );
  
  const filteredSetting = settingItems.filter((item) =>
    item.allowedRoles.includes(activeRole),
  );

  return (
    <nav className="px-2 py-4 flex-1 flex flex-col justify-between overflow-y-auto">
      <ul className="w-full space-y-1">
        {filteredMainflow.length > 0 && (
          <li className={`px-3 pb-2 pt-1 ${!isSidebarExpand ? "text-center" : ""}`}>
            <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              {isSidebarExpand ? "Mainflow" : "•••"}
            </h4>
          </li>
        )}
        {filteredMainflow.map((item) => (
          <MenuItem key={item.href} {...item} />
        ))}
      </ul>
      
      {filteredSetting.length > 0 && (
        <ul className="w-full space-y-1 mt-auto pt-4 border-t border-border/50">
          <li className={`px-3 pb-2 pt-1 ${!isSidebarExpand ? "text-center" : ""}`}>
            <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              {isSidebarExpand ? "Setting" : "•••"}
            </h4>
          </li>
          {filteredSetting.map((item) => (
            <MenuItem key={item.href} {...item} />
          ))}
        </ul>
      )}
    </nav>
  );
};

