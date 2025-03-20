import { format } from "date-fns";

export const exportToCSV = <T extends Record<string, any>>(
  data: T[],
  headers: { key: keyof T; label: string }[],
  filename: string,
) => {
  // Create CSV content
  const headerRow = headers.map((h) => h.label).join(",");
  const rows = data.map((item) => {
    return headers
      .map((header) => {
        const value = item[header.key];
        // Format dates if they look like ISO strings
        const formattedValue =
          typeof value === "string" &&
          value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/)
            ? format(new Date(value), "yyyy-MM-dd HH:mm")
            : value;
        // Wrap in quotes and escape any existing quotes
        return `"${String(formattedValue).replace(/"/g, '""')}"`;
      })
      .join(",");
  });

  const csvContent = [headerRow, ...rows].join("\n");

  // Create and download the file
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `${filename}_${format(new Date(), "yyyy-MM-dd")}.csv`,
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

export const calculateHours = (
  clockIn: string,
  clockOut: string,
  breakMinutes: number = 0,
): { regularHours: number; overtimeHours: number; totalHours: number } => {
  if (!clockIn || !clockOut) {
    return { regularHours: 0, overtimeHours: 0, totalHours: 0 };
  }

  const startTime = new Date(clockIn).getTime();
  const endTime = new Date(clockOut).getTime();
  const diffMinutes = (endTime - startTime) / (1000 * 60) - breakMinutes;
  const totalHours = Math.max(0, diffMinutes / 60);

  // Regular hours are capped at 8 hours per day
  const regularHours = Math.min(8, totalHours);
  const overtimeHours = Math.max(0, totalHours - 8);

  return {
    regularHours: parseFloat(regularHours.toFixed(2)),
    overtimeHours: parseFloat(overtimeHours.toFixed(2)),
    totalHours: parseFloat(totalHours.toFixed(2)),
  };
};
