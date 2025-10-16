import React from "react";
import jsPDF from "jspdf";

const History = ({ history }) => {
  const handleDownloadPDF = async (item) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Pneumonia Detection Report", 20, 20);
    doc.setFontSize(12);
    doc.text(`Date: ${item.date}`, 20, 35);
    doc.text(`Prediction: ${item.prediction}`, 20, 45);

    // If the item has an image preview, add it to PDF
    if (item.preview) {
      const img = new Image();
      img.src = item.preview;

      img.onload = () => {
        const imgWidth = 150;
        const imgHeight = (img.height / img.width) * imgWidth;
        doc.addImage(img, "JPEG", 20, 55, imgWidth, imgHeight);

        // Color-coded result
        doc.setTextColor(
          item.prediction.toLowerCase().includes("pneumonia") ? 255 : 0,
          item.prediction.toLowerCase().includes("pneumonia") ? 0 : 128,
          0
        );
        doc.setFontSize(14);
        doc.text(`Result: ${item.prediction}`, 20, 55 + imgHeight + 10);

        doc.save(
          `pneumonia_report_${item.date.replace(/[: ,]/g, "_")}.pdf`
        );
      };
    } else {
      doc.save(`pneumonia_report_${item.date.replace(/[: ,]/g, "_")}.pdf`);
    }
  };

  if (!history || history.length === 0) {
    return <p className="text-center text-gray-500">No scan history yet.</p>;
  }

  return (
    <div className="w-full max-w-lg mx-auto mt-6 rounded-xl shadow-lg p-4 bg-white border border-gray-200">
      <h2 className="text-xl font-bold mb-4">📜 Scan History</h2>
      <ul className="space-y-3">
        {history.map((item, index) => (
          <li
            key={index}
            className="flex justify-between items-center p-3 rounded-lg bg-gray-100"
          >
            <div>
              <p className="text-sm text-gray-700">{item.date}</p>
              <p
                className={`font-semibold ${
                  item.prediction.toLowerCase().includes("pneumonia")
                    ? "text-red-500"
                    : "text-green-500"
                }`}
              >
                {item.prediction}
              </p>
            </div>
            <button
              onClick={() => handleDownloadPDF(item)}
              className="ml-4 px-3 py-1 rounded-lg bg-purple-500 text-white text-sm hover:bg-purple-600"
            >
              Download PDF
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default History;
