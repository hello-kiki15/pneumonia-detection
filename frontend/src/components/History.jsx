import React from "react";
import { generateAnalysisPDF } from "../utils/pdf";

const History = ({ history }) => {
  if (!history || history.length === 0) {
    return (
      <div className="w-full flex flex-col items-center mt-10">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">
          Scan History
        </h2>
        <p className="text-gray-500">No scan history yet.</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center min-h-screen p-8">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">
        Scan History
      </h2>

      <ul className="w-full max-w-lg space-y-4">
        {history.map((item, index) => {
          const isPneumonia = item.prediction.toLowerCase().includes("pneumonia");

          return (
            <li
              key={index}
              className="flex justify-between items-center border rounded-lg p-4 shadow-sm"
            >
              <div>
                <p className="text-gray-500 text-sm">{item.date}</p>
                {item.patientName && (
                  <p className="text-gray-500 text-sm">👤 {item.patientName}</p>
                )}
                <p
                  className={`font-semibold ${
                    isPneumonia ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {item.prediction}
                </p>
              </div>
              <button
                onClick={() => generateAnalysisPDF(item)}
                className="px-3 py-1 text-sm rounded bg-blue-700 text-white hover:bg-blue-800 transition"
              >
                PDF
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default History;
