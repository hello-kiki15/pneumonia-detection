import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import AnalyzePage from "./pages/AnalyzePage";
import HistoryPage from "./pages/HistoryPage";
import { saveHistory, loadHistory } from "./utils/storage";

function App() {
  const [activeTab, setActiveTab] = useState("analyze");
  const [history, setHistory] = useState([]);

  // Load history from localStorage on first render
  useEffect(() => {
    const storedHistory = loadHistory();
    setHistory(storedHistory);
  }, []);

  // Add new scan to history (max 5 entries)
  const addHistory = (item) => {
    const updatedHistory = [item, ...history].slice(0, 10);
    setHistory(updatedHistory);
    saveHistory(updatedHistory); // Save to localStorage
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex justify-center p-6">
        <div className="w-full max-w-lg">
          {activeTab === "analyze" && <AnalyzePage onResult={addHistory} />}

          {activeTab === "history" && <HistoryPage history={history} />}
        </div>
      </main>
    </div>
  );
}

export default App;
