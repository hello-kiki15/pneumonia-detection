import React, { useState, useEffect } from "react";
import axios from "axios";
import History from "../components/History";

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Not authenticated");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get("http://127.0.0.1:5000/history", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const transformed = res.data.history.map((item) => ({
          id: item.id,
          prediction: item.prediction || item.prediction_type || "Unknown",
          probability: item.confidence_level,
          patientName: item.patientName || "Unknown",
          date: item.created_at
            ? new Date(item.created_at).toLocaleString()
            : new Date(item.date).toLocaleString(),
          imageUrl: item.preview
            ? `http://127.0.0.1:5000${item.preview}`
            : null,
        }));

        setHistory(transformed);
      } catch (err) {
        setError("Failed to load history");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="pt-20 px-4 flex justify-center">
        {loading && <p className="text-gray-400">Loading history...</p>}
        {error && <p className="text-red-400">{error}</p>}
        {!loading && !error && <History history={history} />}
      </div>
    </div>
  );
};

export default HistoryPage;
