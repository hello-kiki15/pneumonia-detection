import React from "react";
import XrayUpload from "../components/XrayUpload";

const AnalyzePage = ({ onResult }) => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex justify-center">
      <div className="w-full pt-20 px-4 flex justify-center">
        <XrayUpload onResult={onResult} />
      </div>
    </div>
  );
};


export default AnalyzePage;
