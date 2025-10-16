import React from "react";
import { Sun, Moon } from "lucide-react";

const Navbar = ({ darkMode, setDarkMode, activeTab, setActiveTab }) => {
  const navbarClasses = darkMode
    ? "bg-white/80 text-gray-900"
    : "bg-black/80 text-gray-100";

  return (
    <header
      className={`w-full px-6 py-4 flex justify-between items-center backdrop-blur-sm transition-colors duration-300 ${navbarClasses}`}
    >
      <h1 className="text-2xl font-bold">PneumoScan</h1>

      <div className="flex items-center gap-6">
        <nav className="flex gap-6">
          <button
            className={`font-semibold pb-1 border-b-2 transition-colors duration-300 ${
              activeTab === "analyze"
                ? "border-current"
                : "border-transparent hover:text-gray-400"
            }`}
            onClick={() => setActiveTab("analyze")}
          >
            Analyze
          </button>
          <button
            className={`font-semibold pb-1 border-b-2 transition-colors duration-300 ${
              activeTab === "history"
                ? "border-current"
                : "border-transparent hover:text-gray-400"
            }`}
            onClick={() => setActiveTab("history")}
          >
            History
          </button>
        </nav>

        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`p-2 rounded-lg transition-colors duration-300 ${
            darkMode
              ? "bg-gray-200 hover:bg-gray-300 text-gray-900"
              : "bg-gray-700 hover:bg-gray-600 text-gray-100"
          }`}
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </header>
  );
};

export default Navbar;
