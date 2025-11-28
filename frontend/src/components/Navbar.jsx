import React from "react";
import { LogOut } from "lucide-react";

const Navbar = ({ activeTab, setActiveTab, onLogout }) => {
  const tabs = ["analyze", "history"];

  return (
    <header className="fixed top-0 left-0 z-30 w-full
                       bg-gray-900/90 backdrop-blur-md
                       border-b border-gray-800">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

        {/* Tabs */}
        <div className="flex gap-10">
          {tabs.map((tab) => {
            const isActive = activeTab === tab;

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                role="tab"
                aria-current={isActive ? "page" : undefined}
                className="relative font-semibold transition"
              >
                <span
                  className={`text-lg ${
                    isActive
                      ? "text-emerald-400"
                      : "text-gray-400 hover:text-gray-200"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </span>

                {/* Active underline */}
                <span
                  className={`absolute left-0 -bottom-2 h-[2px]
                              bg-emerald-500 transition-all duration-300
                              ${isActive ? "w-full" : "w-0"}`}
                />
              </button>
            );
          })}
        </div>

        {/* Logout */}
        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-lg
                     bg-red-500/10 text-red-400
                     hover:bg-red-500/20 hover:text-red-300
                     transition"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </nav>
    </header>
  );
};

export default Navbar;
