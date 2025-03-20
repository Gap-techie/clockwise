import React, { useState } from "react";
import Header from "@/components/timesheet/Header";
import ReportGenerator from "@/components/timesheet/ReportGenerator";
import ReportDisplay from "@/components/timesheet/ReportDisplay";
import { format } from "date-fns";
import { exportToCSV } from "@/lib/utils/exportUtils";

interface DateRange {
  from: Date;
  to?: Date;
}

interface ReportParams {
  dateRange: DateRange;
  employees: string[];
  projects: string[];
}

const ReportsPage = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportParams, setReportParams] = useState<ReportParams | null>(null);
  const [showReport, setShowReport] = useState(false);

  // Mock data for employees and projects
  const employees = [
    { id: "1", name: "John Doe" },
    { id: "2", name: "Jane Smith" },
    { id: "3", name: "Michael Johnson" },
    { id: "4", name: "Emily Williams" },
    { id: "5", name: "Robert Brown" },
  ];

  const projects = [
    { id: "1", name: "Website Redesign" },
    { id: "2", name: "Mobile App Development" },
    { id: "3", name: "Database Migration" },
    { id: "4", name: "Marketing Campaign" },
    { id: "5", name: "Internal Training" },
  ];

  const handleGenerateReport = (params: ReportParams) => {
    setIsGenerating(true);
    setReportParams(params);

    // In a real implementation, this would fetch data from the API based on the params
    // For now, we'll simulate the API call with a timeout
    setTimeout(() => {
      setIsGenerating(false);
      setShowReport(true);
    }, 1500);
  };

  const handleExportToExcel = () => {
    if (!reportParams) return;

    // Create mock data for the report based on the selected parameters
    const reportData = [];

    // Generate sample data based on selected employees and projects
    for (const employeeId of reportParams.employees.length > 0
      ? reportParams.employees
      : employees.map((e) => e.id)) {
      const employee = employees.find((e) => e.id === employeeId);

      for (const projectId of reportParams.projects.length > 0
        ? reportParams.projects
        : projects.map((p) => p.id)) {
        const project = projects.find((p) => p.id === projectId);

        // Generate some random entries within the date range
        const startDate = reportParams.dateRange.from;
        const endDate = reportParams.dateRange.to || new Date();
        const daysDiff = Math.ceil(
          (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
        );

        // Generate up to 3 entries per employee/project combination
        const entriesCount = Math.min(3, daysDiff);

        for (let i = 0; i < entriesCount; i++) {
          const entryDate = new Date(startDate);
          entryDate.setDate(
            startDate.getDate() + Math.floor(Math.random() * daysDiff),
          );

          const regularHours = 7 + Math.random() * 2; // Between 7-9 hours
          const overtimeHours = Math.random() > 0.7 ? Math.random() * 2 : 0; // 30% chance of overtime

          reportData.push({
            date: format(entryDate, "yyyy-MM-dd"),
            employeeName: employee?.name || "Unknown",
            employeeId: employeeId,
            project: project?.name || "Unknown",
            projectId: projectId,
            regularHours: parseFloat(regularHours.toFixed(2)),
            overtimeHours: parseFloat(overtimeHours.toFixed(2)),
            totalHours: parseFloat((regularHours + overtimeHours).toFixed(2)),
          });
        }
      }
    }

    // Define the headers for the CSV export
    const headers = [
      { key: "date", label: "Date" },
      { key: "employeeName", label: "Employee Name" },
      { key: "employeeId", label: "Employee ID" },
      { key: "project", label: "Project" },
      { key: "regularHours", label: "Regular Hours" },
      { key: "overtimeHours", label: "Overtime Hours" },
      { key: "totalHours", label: "Total Hours" },
    ];

    // Use the exportToCSV utility to generate and download the file
    exportToCSV(reportData, headers, "timesheet_report");
  };

  const handlePrintReport = () => {
    console.log("Printing report...");
    // In a real implementation, this would trigger the print functionality
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userRole="admin" />

      <main className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Timesheet Reports</h1>

        <div className="space-y-8">
          <ReportGenerator
            onGenerate={handleGenerateReport}
            onExport={handleExportToExcel}
            isLoading={isGenerating}
            employees={employees}
            projects={projects}
          />

          {showReport && (
            <div className="mt-8">
              <ReportDisplay
                title="Time Tracking Report"
                dateRange={reportParams?.dateRange as { from: Date; to: Date }}
                isLoading={isGenerating}
                onExport={handleExportToExcel}
                onPrint={handlePrintReport}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ReportsPage;
