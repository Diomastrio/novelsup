import React from "react";
import { Search, Bell, Moon, User, BookOpen, PenLine } from "lucide-react";
import { Link } from "react-router-dom";
import ThemeSelector from "./ThemeSelector";
import { useUser } from "../authentication/authHooks";

export default function Navbar() {
  const { user, isAdmin } = useUser();

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
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search novels..."
            className=" border border-gray-700 rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-gray-500 w-64"
          />
        </div>
        <button className="p-2 hover:bg-gray-800 rounded-full">
          <Bell size={20} />
        </button>
        <ThemeSelector />
        <button className="p-2 hover:bg-gray-800 rounded-full">
          <User size={20} />
        </button>
      </div>
    </nav>
  );
}
