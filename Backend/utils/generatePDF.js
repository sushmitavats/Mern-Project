import PDFDocument from "pdfkit";

const generatePDF = (res, leaves) => {
  const doc = new PDFDocument();

  doc.pipe(res);

  doc.fontSize(20).text(
    "Leave Report",
    {
      align: "center",
    }
  );

  leaves.forEach((leave) => {
    doc.moveDown();

    doc.text(
      `${leave.employee_code} - ${leave.name}`
    );

    doc.text(
      `${leave.fromDate} to ${leave.toDate}`
    );

    doc.text(`Status: ${leave.status}`);
  });

  doc.end();
};

export default generatePDF;