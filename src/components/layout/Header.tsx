"use client";

import { Bell } from "lucide-react";
import UserMenu from "./UserMenu";

export default function Header() {
  return (
    <header className="fixed top-0 left-[252px] right-0 h-16 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex items-center justify-end px-6 z-20 transition-colors">
      {/* Right */}
      <div className="flex items-center gap-4">
        {/* Notification */}
        <button className="relative p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <Bell size={18} className="text-gray-500 dark:text-gray-400" />
          <span className="absolute top-1.5 right-1.5 size-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-900" />
        </button>

        <UserMenu />
      </div>
    </header>
  );
}
