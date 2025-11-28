import React from "react";
import { generateAnalysisPDF } from "../utils/pdf";

const History = ({ history }) => {
  const isPneumoniaPrediction = (prediction) =>
    prediction?.toLowerCase().includes("pneumonia");

  return (
    <div className="w-full max-w-4xl">
      {/* Page Title */}
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Scan History</h2>
        <p className="text-gray-400">
          View and download previous X-ray analysis reports
        </p>
      </div>

      {(!history || history.length === 0) && (
        <div className="text-center text-gray-400 mt-20">
          No scan history yet.
        </div>
      )}

      {/* History list */}
      <ul className="space-y-5">
        {history.map((item) => {
          const pneumonia = isPneumoniaPrediction(item.prediction);

          return (
            <li
              key={item.id}
              className="flex flex-col md:flex-row items-center gap-4
                         p-5 rounded-2xl
                         bg-gray-800/70 backdrop-blur-md
                         border border-gray-700
                         hover:border-emerald-600/50
                         transition"
            >
              {/* Image */}
              {item.imageUrl && (
                <img
                  loading="lazy"
                  src={item.imageUrl}
                  alt="X-ray preview"
                  className="w-24 h-24 object-contain rounded-xl bg-black/30 border border-gray-700"
                />
              )}

              {/* Info */}
              <div className="flex-1 w-full">
                <p className="text-sm text-gray-400">{item.date}</p>

                {item.patientName && (
                  <p className="text-gray-300 font-medium mt-1">
                    👤 {item.patientName}
                  </p>
                )}

                <p
                  className={`text-lg font-semibold mt-1 ${
                    pneumonia ? "text-red-400" : "text-green-400"
                  }`}
                >
                  {item.prediction}
                </p>
              </div>

              {/* Actions */}
              <button
                onClick={() => generateAnalysisPDF(item)}
                className="px-5 py-2.5 rounded-lg text-sm font-semibold
                           bg-emerald-600 text-white
                           hover:bg-emerald-700
                           hover:shadow-lg hover:shadow-emerald-600/40
                           transition"
              >
                Download PDF
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default History;
