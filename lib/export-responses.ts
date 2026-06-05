import { buildExportData } from "./response-data";
import type { FormResponse, VSMForm } from "./supabase";

function sanitizeFilename(title: string): string {
  return title
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .toLowerCase()
    .slice(0, 60) || "form-responses";
}

export async function exportResponsesToExcel(
  form: VSMForm,
  responses: FormResponse[]
) {
  const XLSX = await import("xlsx");
  const { headers, rows } = buildExportData(form, responses);
  const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Responses");
  XLSX.writeFile(workbook, `${sanitizeFilename(form.title)}-responses.xlsx`);
}

export async function exportResponsesToPdf(
  form: VSMForm,
  responses: FormResponse[]
) {
  const { jsPDF } = await import("jspdf");
  const autoTable = (await import("jspdf-autotable")).default;
  const { headers, rows } = buildExportData(form, responses);

  const doc = new jsPDF({ orientation: "landscape" });
  doc.setFontSize(14);
  doc.text(form.title, 14, 16);
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`${responses.length} response${responses.length === 1 ? "" : "s"}`, 14, 23);

  autoTable(doc, {
    head: [headers],
    body: rows,
    startY: 28,
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [232, 100, 10] },
    alternateRowStyles: { fillColor: [252, 248, 240] },
  });

  doc.save(`${sanitizeFilename(form.title)}-responses.pdf`);
}
