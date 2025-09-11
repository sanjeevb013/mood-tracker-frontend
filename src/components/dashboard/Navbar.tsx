"use client";

import { Menu, Search, Bell, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ThemeToggle from "../buttons/ToggleButton";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useAuth } from "@/providers/AuthProvider"; // ✅ use your auth context

interface NavbarProps {
  toggleSidebar: () => void;
}

export default function Navbar({ toggleSidebar }: NavbarProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const { user, logout } = useAuth(); // ✅ useAuth context

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }

    if (isProfileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileOpen]);

  const handleSignOut = async () => {
    try {
      logout(); // ✅ use context logout (clears tokens + redirects)
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const baseText = isDark ? "text-white" : "text-black";
  const hoverText = isDark ? "hover:text-white" : "hover:text-gray-900";
  const hoverBg = isDark ? "hover:bg-gray-800" : "hover:bg-gray-100";
  const borderColor = isDark ? "border-gray-700" : "border-gray-200";
  const bgColor = isDark ? "bg-[var(--background)]" : "bg-white";

  return (
    <nav
      ref={dropdownRef}
      className={`w-full h-16 ${bgColor} ${baseText} ${borderColor} border-b shadow-sm fixed top-0 z-50 backdrop-blur-md`}
    >
      <div className="flex items-center justify-between px-4 lg:px-6 h-full">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className={`lg:hidden p-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${hoverText} ${hoverBg}`}
            aria-label="Toggle sidebar"
          >
            <Menu size={20} />
          </button>

          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              MD
            </div>
            <h1 className={`text-xl font-bold hidden sm:block ${baseText}`}>My Dashboard</h1>
          </div>
        </div>

        {/* Center Section */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search..."
              className={`w-full pl-10 pr-4 py-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                isDark
                  ? "bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-400"
                  : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500"
              }`}
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2">
          <button
            className={`md:hidden p-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${hoverText} ${hoverBg}`}
          >
            <Search size={18} />
          </button>

          <ThemeToggle />

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className={`p-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 relative ${hoverText} ${hoverBg}`}
            >
              <Bell size={18} />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
              </span>
            </button>

            {isNotificationOpen && (
              <div
                className={`absolute right-0 mt-2 w-80 rounded-lg shadow-lg z-50 overflow-hidden ${
                  isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                }`}
              >
                <div className={`p-4 border-b ${borderColor}`}>
                  <h3 className={`text-sm font-semibold ${baseText}`}>Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  <div className={`p-4 border-b ${borderColor} ${hoverBg}`}>
                    <p className={`text-sm font-medium ${baseText}`}>New report generated</p>
                    <p className="text-xs text-gray-500 mt-1">2 minutes ago</p>
                  </div>
                  <div className={`p-4 ${hoverBg}`}>
                    <p className={`text-sm font-medium ${baseText}`}>Profile updated successfully</p>
                    <p className="text-xs text-gray-500 mt-1">1 hour ago</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className={`flex items-center space-x-2 p-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${hoverText} ${hoverBg}`}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                {/* {user?.email?.[0]?.toUpperCase() ?? "?"} */}
              </div>
              <ChevronDown size={16} className="hidden sm:block" />
            </button>

            {isProfileOpen && (
              <div
                className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg z-50 overflow-hidden ${
                  isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                }`}
              >
                <div className={`p-4 border-b ${borderColor}`}>
                  <p className={`text-sm font-medium ${baseText}`}>
                    {/* {user?.email ?? "Guest"} */}
                  </p>
                </div>
                <div className="py-2">
                  <a
                    href="/dashboard/profile"
                    className={`block px-4 py-2 text-sm transition-colors duration-200 ${hoverText} ${hoverBg}`}
                  >
                    View Profile
                  </a>
                  <a
                    href="/dashboard/settings"
                    className={`block px-4 py-2 text-sm transition-colors duration-200 ${hoverText} ${hoverBg}`}
                  >
                    Settings
                  </a>
                  <hr className={`my-2 ${borderColor}`} />
                  <button
                    onClick={handleSignOut}
                    className={`block w-full text-left px-4 py-2 text-sm transition-colors duration-200 cursor-pointer ${
                      isDark ? "text-red-400 hover:bg-gray-700" : "text-red-600 hover:bg-gray-100"
                    }`}
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {(isProfileOpen || isNotificationOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsProfileOpen(false);
            setIsNotificationOpen(false);
          }}
        />
      )}
    </nav>
  );
}
