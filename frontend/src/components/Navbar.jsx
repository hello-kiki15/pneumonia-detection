import React from "react";

const Navbar = ({ activeTab, setActiveTab }) => {
  return (
    <header className="w-full border-b border-[#0B0B45]">
      <nav className="flex justify-center gap-12 py-4">
        {["analyze", "history"].map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`transition-all duration-300 font-semibold ${
                isActive
                  ? "text-[#0B0B45] text-lg"
                  : "text-[#6C757D] text-base hover:text-[#0B0B45]"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          );
        })}
      </nav>
    </header>
  );
};

export default Navbar;
