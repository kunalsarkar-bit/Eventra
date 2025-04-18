import React, { useState } from "react";
import { useThemeProvider } from "../contexts/ThemeProvider";
import { TicketIcon, BarChart3, ScanLine } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

export default function NavigationTabs() {
  const { currentTheme } = useThemeProvider();
  const location = useLocation();
  const pathname = location.pathname;
  const [loggingOut, setLoggingOut] = useState(false);

  const logout = async () => {
    setLoggingOut(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/logout",
        {},
        {
          withCredentials: true,
        }
      );

      if (res.data.success) {
        window.location.href = "/";
      }
      setLoggingOut(false);
    } catch (err) {
      console.error("Logout failed:", err.response?.data || err.message);
    }
  };

  const tabs = [
    {
      name: "Tickets",
      path: "/home",
      icon: <TicketIcon size={16} className="sm:mr-1" />,
    },
    {
      name: "Stats",
      path: "/stats",
      icon: <BarChart3 size={16} className="sm:mr-1" />,
    },
    {
      name: "Scan",
      path: "/validate",
      icon: <ScanLine size={16} className="sm:mr-1" />,
    },
  ];

  return (
    <div
      className={`${
        currentTheme === "dark" ? "bg-gray-900" : "bg-gray-50"
      } border-b ${
        currentTheme === "dark" ? "border-gray-800" : "border-gray-200"
      }`}
    >
      <div className="container mx-auto px-2 sm:px-4 flex items-center justify-between">
        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <Link
              key={tab.path}
              to={tab.path}
              className={`flex items-center py-3 px-3 sm:py-4 sm:px-6 text-xs sm:text-base font-medium border-b-2 whitespace-nowrap ${
                pathname === tab.path
                  ? currentTheme === "dark"
                    ? "border-purple-500 text-purple-400"
                    : "border-purple-600 text-purple-700"
                  : currentTheme === "dark"
                  ? "border-transparent text-gray-400 hover:text-gray-300"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              } transition-colors`}
            >
              {tab.icon}
              <span className="hidden sm:inline ml-1">{tab.name}</span>
            </Link>
          ))}
        </div>

        {/* Smaller Logout Button */}
        <button
          onClick={logout}
          className={`ml-2 cursor-pointer text-xs sm:text-sm px-2 py-1.5 sm:px-3 sm:py-2 rounded-md transition duration-200 whitespace-nowrap ${
            currentTheme === "dark"
              ? "bg-red-600 hover:bg-red-700 text-white"
              : "bg-red-500 hover:bg-red-600 text-white"
          }`}
        >
          {loggingOut ? "Logging out..." : "Logout"}
        </button>
      </div>
    </div>
  );
}
