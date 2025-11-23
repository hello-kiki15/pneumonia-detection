import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "../components/Button"

const XrayUpload = ({ onResult }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState("");
  const [probability, setProbability] = useState(null);
  const [loading, setLoading] = useState(false);
  const [patientName, setPatientName] = useState("");

  // Load saved patient name
  useEffect(() => {
    const savedName = localStorage.getItem("patientName");
    if (savedName) setPatientName(savedName);
  }, []);

  // Save name as user types
  const handleNameChange = (e) => {
    const name = e.target.value;
    setPatientName(name);
    localStorage.setItem("patientName", name);
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    setResult("");
    setProbability(null);
    setPreview(selectedFile ? URL.createObjectURL(selectedFile) : null);
  };

  // Upload and get prediction
  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("http://127.0.0.1:5000/predict", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const reportData = {
        date: new Date().toLocaleString(),
        prediction: res.data.prediction,
        probability: res.data.probability,
        preview: preview,
        patientName: patientName || "Unknown",
      };

      if (onResult) onResult(reportData);

      setResult(res.data.prediction);
      setProbability(res.data.probability);
    } catch (error) {
      console.error("Upload error:", error);
      setResult("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto mt-6">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">Pneumonia Detection</h1>

      {/* Patient name input */}
      <input
        type="text"
        placeholder="Patient Name (optional)"
        value={patientName}
        onChange={handleNameChange}
        className="w-full mb-4 px-4 py-2 rounded-lg outline-none border border-gray-300"
      />

      {/* Preview */}
      {preview && (
        <img
          src={preview}
          className="max-h-64 mb-4 rounded-lg shadow"
          alt="preview"
        />
      )}

      {/* File upload */}
      <input
        type="file"
        onChange={handleFileChange}
        className="mb-4 block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-gray-300 file:text-gray-900 cursor-pointer"
      />

      {/* Analyze button */}
      <Button onClick={handleUpload} disabled={loading || !file} className="w-full mb-3">
  {loading ? "Analyzing..." : "🔍 Analyze X-ray"}
</Button>

      {/* Result */}
      {result && (
        <div
          className={`mt-4 p-4 rounded-xl text-lg font-semibold ${
            result.toLowerCase().includes("pneumonia")
              ? "bg-red-200/40 text-red-600"
              : "bg-green-200/40 text-green-600"
          }`}
        >
          Prediction: {result}{" "}
          {probability !== null && <span>({(probability * 100).toFixed(2)}%)</span>}
        </div>
      )}
    </div>
  );
};

export default XrayUpload;
