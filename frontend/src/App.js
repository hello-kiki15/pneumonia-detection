import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import AnalyzePage from "./pages/AnalyzePage";
import HistoryPage from "./pages/HistoryPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

function App() {
  const [activeTab, setActiveTab] = useState("analyze");
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("token"));

  const handleLogin = () => {
    setLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
  };

  if (!loggedIn) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        {/* Navbar */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onLogout={handleLogout}
        />

        {/* Page content */}
        <div className="pt-20">
          {activeTab === "analyze" && <AnalyzePage />}
          {activeTab === "history" && <HistoryPage />}
        </div>
      </div>
    </Router>
  );
}

export default App;
