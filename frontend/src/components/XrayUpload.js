import React, { useState } from "react";
import axios from "axios";

const XrayUpload = ({ onResult, darkMode }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState("");
  const [probability, setProbability] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    setResult("");
    setProbability(null);
    setPreview(selectedFile ? URL.createObjectURL(selectedFile) : null);
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("http://127.0.0.1:5000/predict", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setResult(res.data.prediction);
      setProbability(res.data.probability);

      if (onResult) {
        onResult({
          date: new Date().toLocaleString(),
          prediction: res.data.prediction,
          probability: res.data.probability,
          preview: preview,
        });
      }
    } catch (error) {
      console.error("Upload error:", error);
      setResult("Something went wrong");
      setProbability(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`w-full max-w-lg mx-auto rounded-3xl shadow-xl p-8 border transition-colors duration-500 ${
        darkMode
          ? "bg-gray-900 border-gray-700 text-gray-100"
          : "bg-gray-50 border-gray-200 text-gray-900"
      }`}
    >
      <h1
        className={`text-3xl font-bold mb-2 transition-colors duration-500 ${
          darkMode ? "text-gray-200" : "text-gray-800"
        }`}
      >
        Pneumonia Detection
      </h1>
      <p
        className={`mb-6 transition-colors duration-500 ${
          darkMode ? "text-gray-400" : "text-gray-700"
        }`}
      >
        Upload a chest X-ray image for AI analysis.
      </p>

      {preview && (
        <div className="mb-4">
          <img
            src={preview}
            alt="X-ray Preview"
            className="max-h-64 rounded-lg shadow border border-gray-600 grayscale"
          />
        </div>
      )}

      <input
        type="file"
        onChange={handleFileChange}
        className={`block w-full text-sm mb-4 file:mr-4 file:py-2 file:px-4
                   file:rounded-full file:border-0 file:text-sm file:font-semibold
                   cursor-pointer transition-colors duration-500 ${
                     darkMode
                       ? "file:bg-gray-700 file:text-gray-100 hover:file:bg-gray-600"
                       : "file:bg-gray-300 file:text-gray-900 hover:file:bg-gray-400"
                   }`}
      />

      <button
        onClick={handleUpload}
        disabled={loading || !file}
        className={`w-full py-3 rounded-xl font-bold text-lg transition-all duration-300 mb-3 ${
          loading || !file
            ? "bg-gray-500 cursor-not-allowed"
            : darkMode
            ? "bg-gray-700 text-gray-100 shadow-lg hover:bg-gray-600"
            : "bg-gray-300 text-gray-900 shadow-lg hover:bg-gray-400"
        }`}
      >
        {loading ? "Analyzing..." : "🔍 Analyze X-ray"}
      </button>

      {result && (
        <div
          className={`mt-4 p-4 rounded-xl text-lg font-semibold shadow-lg transition-colors duration-500 ${
            result.toLowerCase().includes("pneumonia")
              ? darkMode
                ? "bg-red-800/30 text-red-400 border border-red-500"
                : "bg-red-200/40 text-red-600 border border-red-500"
              : darkMode
              ? "bg-green-800/30 text-green-400 border border-green-500"
              : "bg-green-200/40 text-green-600 border border-green-500"
          }`}
        >
          🩺 Prediction: {result}{" "}
          {probability !== null && (
            <span>({(probability * 100).toFixed(2)}%)</span>
          )}
        </div>
      )}
    </div>
  );
};

export default XrayUpload;
