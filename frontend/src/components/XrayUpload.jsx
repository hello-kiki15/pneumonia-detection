import React, { useState } from "react";
import axios from "axios";
import Button from "../components/Button";
import { Upload, AlertCircle, CheckCircle2, Loader2, User } from "lucide-react";

const XrayUpload = ({ onResult }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [serverImageUrl, setServerImageUrl] = useState(null);
  const [result, setResult] = useState("");
  const [probability, setProbability] = useState(null);
  const [loading, setLoading] = useState(false);
  const [patientName, setPatientName] = useState("");
  const [error, setError] = useState("");

  const handleNameChange = (e) => {
    setPatientName(e.target.value);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    setResult("");
    setProbability(null);
    setServerImageUrl(null);
    setError("");
    setPreview(selectedFile ? URL.createObjectURL(selectedFile) : null);
  };

  const handleUpload = async () => {
    if (!file) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to upload.");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("patientName", patientName);

    try {
      const res = await axios.post("http://127.0.0.1:5000/predict", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      const reportData = {
        date: new Date().toLocaleString(),
        prediction: res.data.prediction,
        probability: res.data.probability,
        preview: `http://127.0.0.1:5000${res.data.image_url}`,
        patientName: patientName || "Unknown",
      };

      if (onResult) onResult(reportData);

      setResult(res.data.prediction);
      setProbability(res.data.probability);
      setServerImageUrl(`http://127.0.0.1:5000${res.data.image_url}`);
    } catch (error) {
      if (error.response) {
        setError(
          error.response.data.error ||
            "Failed to analyze X-ray. Please try again."
        );
      } else {
        setError("Unable to connect to server. Please check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl p-2">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Pneumonia Detection
          </h1>
          <p className="text-gray-400">
            Upload an X-ray image for AI-powered analysis
          </p>
        </div>

        <div className="space-y-6">
          {/* Patient Name */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">
              <User className="w-4 h-4 inline mr-2" />
              Patient Name (Optional)
            </label>
            <input
              type="text"
              value={patientName}
              onChange={handleNameChange}
              placeholder="Enter patient name"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/50 outline-none transition"
            />
          </div>

          {/* Image Preview */}
          {(serverImageUrl || preview) && (
            <div className="relative">
              <img
                src={serverImageUrl || preview}
                alt="Preview"
                className="w-full max-h-64 object-contain rounded-lg border-2 border-gray-700 shadow-xl"
              />
            </div>
          )}

          {/* File Upload */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">
              <Upload className="w-4 h-4 inline mr-2" />
              Upload X-ray Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-400
              file:mr-4 file:py-3 file:px-6
              file:rounded-lg file:border-0
              file:font-semibold file:bg-gray-800 file:text-gray-300
              file:border file:border-gray-700
              hover:file:bg-gray-700
              bg-gray-800 border border-gray-700 rounded-lg
              focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/50 cursor-pointer"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          {/* Result */}
          {result && !error && (
            <div
              className={`flex items-start gap-3 p-4 rounded-lg border ${
                result.toLowerCase().includes("pneumonia")
                  ? "bg-red-500/10 border-red-500/50"
                  : "bg-green-500/10 border-green-500/50"
              }`}
            >
              {result.toLowerCase().includes("pneumonia") ? (
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
              )}

              <div>
                <p
                  className={`text-sm font-semibold ${
                    result.toLowerCase().includes("pneumonia")
                      ? "text-red-300"
                      : "text-green-300"
                  }`}
                >
                  Prediction: {result}
                </p>

                {probability !== null && (
                  <p
                    className={`text-sm mt-1 ${
                      result.toLowerCase().includes("pneumonia")
                        ? "text-red-400"
                        : "text-green-400"
                    }`}
                  >
                    Confidence: {(probability * 100).toFixed(2)}%
                  </p>
                )}
              </div>
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={loading || !file}
            className={`w-full py-3 text-lg font-semibold rounded-lg
    flex items-center justify-center gap-2 transition-all
    ${
      loading || !file
        ? "bg-emerald-600/50 cursor-not-allowed"
        : "bg-emerald-600 hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-600/40"
    }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing X-ray...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                Analyze X-ray
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default XrayUpload;
