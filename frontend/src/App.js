import React, { useState } from "react";
import Navbar from "./components/Navbar";
import History from "./components/History";
import XrayUpload from "./components/XrayUpload";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState("analyze");
  const [history, setHistory] = useState([]);

  const addHistory = (item) => {
    setHistory([item, ...history].slice(0, 5));
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-500`}
      style={{
        backgroundColor: darkMode ? "#000000" : "#f5f5f5",
      }}
    >
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <main className="flex justify-center p-6">
        <div className="w-full max-w-lg">
          {activeTab === "analyze" && (
            <XrayUpload onResult={addHistory} darkMode={darkMode} />
          )}
          {activeTab === "history" && (
            <History history={history} darkMode={darkMode} />
          )}
        </div>
      </main>
    </div>
  );
}

export default App