import jsPDF from "jspdf";

export const generateAnalysisPDF = (item) => {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text("Pneumonia Detection Report", 20, 20);

  doc.setFontSize(12);
  doc.text(`Date: ${item.date || "N/A"}`, 20, 35);
  doc.text(`Patient Name: ${item.patientName || "N/A"}`, 20, 45);
  doc.text(`Prediction: ${item.prediction || "N/A"}`, 20, 55);

  // Include confidence if available
  if (item.probability !== undefined && item.probability !== null) {
    doc.text(`Confidence: ${(item.probability * 100).toFixed(2)}%`, 20, 65);
  }

  if (item.preview) {
    const img = new Image();
    img.src = item.preview;
    img.onload = () => {
      const imgWidth = 150;
      const imgHeight = (img.height / img.width) * imgWidth;
      doc.addImage(img, "JPEG", 20, 75, imgWidth, imgHeight);
      doc.save(`report_${item.date.replace(/[: ,]/g, "_")}.pdf`);
    };
  } else {
    doc.save(`report_${item.date.replace(/[: ,]/g, "_")}.pdf`);
  }
};
