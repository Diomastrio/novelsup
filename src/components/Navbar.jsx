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
import { Link } from "react-router-dom";
import ThemeSelector from "./ThemeSelector";
import { useUser, useLogout } from "../authentication/authHooks";

export default function Navbar() {
  const { user, isAdmin } = useUser();
  const { logout } = useLogout();

  const handleLogout = () => {
    logout();
    // The redirect to login page is already handled in the useLogout hook
  };

  return (
    <nav className="flex items-center justify-between p-4 border-b border-gray-800">
      <div className="flex items-center space-x-6">
        <div className="flex items-center">
          <BookOpen className="mr-2" />
          <Link to="/home" className="font-bold text-lg">
            NovelNest
          </Link>
        </div>
        <div className="space-x-6">
          <Link to="/browse" className="hover:text-gray-300">
            Browse
          </Link>
          <Link to="/bookmarks" className="hover:text-gray-300">
            Bookmarks
          </Link>
          {user && (
            <Link
              to={isAdmin ? "/dashboard" : "/publish"}
              className="hover:text-gray-300"
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
        <Link to="/profile" className="p-2 hover:bg-gray-800 rounded-full">
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
