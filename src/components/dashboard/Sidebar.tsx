"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  Settings,
  FileText,
  ChevronRight,
  X,
} from "lucide-react";
import { useTheme } from "next-themes";

interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
}

const menuItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/dashboard/profile",
    label: "Profile",
    icon: User,
  },
  {
    href: "/dashboard/settings",
    label: "Settings",
    icon: Settings,
  },
  {
    href: "/dashboard/reports",
    label: "Reports",
    icon: FileText,
  },
];

export default function Sidebar({ isOpen, closeSidebar }: SidebarProps) {
  const pathname = usePathname();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  const bgColor = isDark ? "bg-gray-900" : "bg-gray-50";
  const borderColor = isDark ? "border-gray-700" : "border-gray-200";
  const textColor = isDark ? "text-white" : "text-black";
const hoverBg = isDark ? "hover:bg-gray-800" : "hover:bg-gray-200";
const hoverText = isDark ? "hover:text-white" : "hover:text-black";

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={`fixed top-16 left-0 h-full w-72 ${bgColor} ${borderColor} border-r shadow-lg transform transition-all duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between p-4 border-b ${borderColor} lg:hidden`}
        >
          <h2 className={`text-lg font-semibold ${textColor}`}>Menu</h2>
          <button
            onClick={closeSidebar}
            className={`p-2 rounded-lg transition-colors duration-200 text-gray-500 ${
              isDark
                ? "hover:bg-gray-800 hover:text-gray-200"
                : "hover:bg-gray-100 hover:text-gray-700"
            }`}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
             <Link
  key={item.href}
  href={item.href}
  onClick={closeSidebar}
  className={`group flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ease-in-out ${
    active
      ? `bg-blue-50 ${isDark ? "dark:bg-blue-900/30 text-gray-300":"bg-gray-200 text-gray-700" }  dark:text-blue-300 shadow-sm`
      : `${hoverBg} ${hoverText} ${isDark ? "text-gray-300" : "text-gray-700"}`
  }`}
>
                <Icon
                  size={20}
                  className={`mr-3 transition-colors duration-200 ${
                    active
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300"
                  }`}
                />
                <span className="flex-1">{item.label}</span>
                {active && (
                  <ChevronRight
                    size={16}
                    className="text-blue-600 dark:text-blue-400 transform transition-transform duration-200"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div
          className={`absolute bottom-0 left-0 right-0 p-4 border-t ${borderColor} ${
            isDark ? "bg-gray-800/50" : "bg-gray-100"
          }`}
        >
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
            © 2025 Your App Name
          </div>
        </div>
      </aside>
    </>
  );
}