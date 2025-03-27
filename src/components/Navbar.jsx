import React from "react";
import {
  Search,
  Bell,
  Moon,
  UserRoundPen,
  BookOpen,
  PenLine,
  LogOut,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import ThemeSelector from "./ThemeSelector";
import { useUser, useLogout } from "../authentication/authHooks";
import { useThemeStore } from "../store/useThemeStore";

export default function Navbar() {
  const { user, isAdmin } = useUser();
  const { logout } = useLogout();
  const { theme } = useThemeStore();
  const location = useLocation();

  const darkThemes = [
    "dark",
    "night",
    "black",
    "luxury",
    "dracula",
    "business",
    "coffee",
    "forest",
    "halloween",
    "synthwave",
    "cyberpunk",
    "dim",
    "nord",
  ];

  const src = darkThemes.includes(theme) ? "/spiroL.png" : "/spiroD.png";

  const handleLogout = () => {
    logout();
    // The redirect to login page is already handled in the useLogout hook
  };

  // Helper function to determine if a link is active
  const isActive = (path) => {
    return location.pathname === path ? "font-bold text-lg" : "";
  };

  return (
    <nav className="flex items-center justify-between p-4 border-b border-gray-800">
      <div className="flex items-center space-x-6 ">
        <img src={src} alt="Logo" className="h-[3.5rem] w-[3.5rem] " />
        <div className="flex items-center">
          <Link
            to="/home"
            className={` text-primary hover:opacity-80 ${isActive("/home")}`}
          >
            Home
          </Link>
        </div>
        <div className="space-x-6">
          <Link
            to="/browse"
            className={`text-primary hover:opacity-80 ${isActive("/browse")}`}
          >
            Browse
          </Link>
          <Link
            to="/bookmarks"
            className={`text-primary hover:opacity-80 ${isActive(
              "/bookmarks"
            )}`}
          >
            Bookmarks
          </Link>
          {user && (
            <Link
              to={isAdmin ? "/dashboard" : "/publish"}
              className={`text-primary hover:opacity-80 ${isActive(
                isAdmin ? "/dashboard" : "/publish"
              )}`}
            >
              {isAdmin ? "Dashboard" : "Publish"}
            </Link>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <button className="p-2 hover:bg-gray-800 rounded-full">
          <Bell size={20} />
        </button>
        <ThemeSelector />
        <Link
          to="/profile"
          className={`p-2 hover:bg-gray-800 rounded-full ${
            isActive("/profile") ? "bg-gray-700" : ""
          }`}
        >
          <UserRoundPen size={20} />
        </Link>
        <button
          onClick={handleLogout}
          className="p-2 hover:bg-gray-800 rounded-full"
        >
          <LogOut size={20} />
        </button>
      </div>
    </nav>
  );
}
