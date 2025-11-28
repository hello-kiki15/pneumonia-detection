import jsPDF from "jspdf";

export const generateAnalysisPDF = (item) => {
  const doc = new jsPDF({
    unit: "pt",
    format: "a4",
    compress: true,
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 40;
  let cursorY = margin;

  // Title
  doc.setFontSize(22);
  doc.setTextColor("#0B0B45");
  doc.setFont("helvetica", "bold");
  doc.text("Pneumonia Detection Report", pageWidth / 2, cursorY, { align: "center" });

  cursorY += 15;
  doc.setDrawColor("#0B0B45");
  doc.setLineWidth(1);
  doc.line(margin, cursorY, pageWidth - margin, cursorY); 
  cursorY += 25;

  // Function to print label and value with styling
  const printLabelValue = (label, value) => {
    doc.setFontSize(12);
    doc.setTextColor("#444");
    doc.setFont("helvetica", "bold");
    doc.text(`${label}:`, margin, cursorY);
    doc.setFont("helvetica", "normal");
    doc.setTextColor("#222");
    doc.text(`${value}`, margin + 110, cursorY);
    cursorY += 20;
  };

  printLabelValue("Date", item.date || "N/A");
  printLabelValue("Patient Name", item.patientName || "N/A");
  printLabelValue("Prediction", item.prediction || "N/A");

  if (item.probability !== undefined && item.probability !== null) {
    printLabelValue("Confidence", `${(item.probability * 100).toFixed(2)}%`);
  }

  cursorY += 10;

  if (item.imageUrl) {
    const safeDate = (item.date || "unknown_date").replace(/[: ,]/g, "_");

    fetch(item.imageUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const reader = new FileReader();
        reader.onload = function () {
          const imgData = reader.result;
          const imgWidth = pageWidth - margin * 2;
          const img = new Image();
          img.src = imgData;
          img.onload = () => {
            const imgHeight = (img.height / img.width) * imgWidth;

            doc.setDrawColor("#0B0B45");
            doc.setLineWidth(1);
            doc.rect(margin, cursorY, imgWidth, imgHeight);

            doc.addImage(imgData, "JPEG", margin, cursorY, imgWidth, imgHeight);

            cursorY += imgHeight + 20;

            doc.save(`report_${safeDate}.pdf`);
          };
        };
        reader.readAsDataURL(blob);
      })
      .catch(() => {
        doc.save(`report_${safeDate}.pdf`);
      });
  } else {
    doc.save("report.pdf");
  }
};
