import { MenuItem, type MenuItemProps } from "./menu-item";

const menuItems: MenuItemProps[] = [
  {
    href: "/dashboard",
    icon: "LayoutDashboard",
    label: "Dashboard",
  },
  {
    href: "/pipeline",
    icon: "Activity",
    label: "Pipeline",
  },
  {
    href: "/handoff",
    icon: "FileCheck",
    label: "Handoff",
  },
  {
    href: "/settings/users",
    icon: "Users",
    label: "User Management",
  },
  {
    href: "/settings/general-params",
    icon: "SlidersHorizontal",
    label: "Parameter Sistem",
  },
];

export const Navigation = () => {
  return (
    <nav className="px-2 py-4 flex-1">
      <ul className="w-full space-y-1">
        {menuItems.map((item) => (
          <MenuItem key={item.href} {...item} />
        ))}
      </ul>
    </nav>
  );
};
