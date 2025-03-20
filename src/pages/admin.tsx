import React, { useState } from "react";
import Header from "@/components/timesheet/Header";
import AdminFilters from "@/components/timesheet/AdminFilters";
import EmployeeTimeEntriesTable from "@/components/timesheet/EmployeeTimeEntriesTable";
import { addDays, format } from "date-fns";

interface DateRange {
  from: Date;
  to?: Date;
}

const AdminPage = () => {
  // State for filters
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });
  const [selectedEmployee, setSelectedEmployee] = useState<string>("all");
  const [selectedProject, setSelectedProject] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Mock data for time entries
  const timeEntries = [
    {
      id: "1",
      employeeName: "John Doe",
      employeeId: "EMP001",
      date: "2023-06-01",
      project: "Website Redesign",
      clockIn: "09:00 AM",
      clockOut: "05:30 PM",
      breaks: 30,
      regularHours: 8,
      overtimeHours: 0,
      totalHours: 8,
      status: "approved" as const,
    },
    {
      id: "2",
      employeeName: "Jane Smith",
      employeeId: "EMP002",
      date: "2023-06-01",
      project: "Mobile App Development",
      clockIn: "08:30 AM",
      clockOut: "06:45 PM",
      breaks: 45,
      regularHours: 8,
      overtimeHours: 1.5,
      totalHours: 9.5,
      status: "pending" as const,
    },
    {
      id: "3",
      employeeName: "Robert Johnson",
      employeeId: "EMP003",
      date: "2023-06-01",
      project: "Database Migration",
      clockIn: "09:15 AM",
      clockOut: "04:45 PM",
      breaks: 60,
      regularHours: 6.5,
      overtimeHours: 0,
      totalHours: 6.5,
      status: "rejected" as const,
    },
    {
      id: "4",
      employeeName: "Emily Davis",
      employeeId: "EMP004",
      date: "2023-06-02",
      project: "Client Meeting",
      clockIn: "10:00 AM",
      clockOut: "07:00 PM",
      breaks: 30,
      regularHours: 8,
      overtimeHours: 0.5,
      totalHours: 8.5,
      status: "pending" as const,
    },
    {
      id: "5",
      employeeName: "Michael Wilson",
      employeeId: "EMP005",
      date: "2023-06-02",
      project: "Bug Fixes",
      clockIn: "09:00 AM",
      clockOut: "08:30 PM",
      breaks: 60,
      regularHours: 8,
      overtimeHours: 2.5,
      totalHours: 10.5,
      status: "approved" as const,
    },
  ];

  // State for filtered entries
  const [filteredEntries, setFilteredEntries] = useState(timeEntries);

  // Handler functions
  const handleDateRangeChange = (range: DateRange) => {
    setDateRange(range);
  };

  const handleEmployeeChange = (employee: string) => {
    setSelectedEmployee(employee);
  };

  const handleProjectChange = (project: string) => {
    setSelectedProject(project);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleReset = () => {
    setDateRange({
      from: new Date(),
      to: addDays(new Date(), 7),
    });
    setSelectedEmployee("all");
    setSelectedProject("all");
    setSearchQuery("");
    setFilteredEntries(timeEntries);
  };

  const handleApplyFilters = () => {
    // Filter the time entries based on the selected criteria
    let filtered = [...timeEntries];

    // Filter by date range
    if (dateRange.from) {
      const fromDate = format(dateRange.from, "yyyy-MM-dd");
      filtered = filtered.filter((entry) => entry.date >= fromDate);
    }

    if (dateRange.to) {
      const toDate = format(dateRange.to, "yyyy-MM-dd");
      filtered = filtered.filter((entry) => entry.date <= toDate);
    }

    // Filter by employee
    if (selectedEmployee !== "all") {
      filtered = filtered.filter(
        (entry) => entry.employeeId === selectedEmployee,
      );
    }

    // Filter by project
    if (selectedProject !== "all") {
      filtered = filtered.filter((entry) =>
        entry.project.toLowerCase().includes(selectedProject.toLowerCase()),
      );
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (entry) =>
          entry.employeeName.toLowerCase().includes(query) ||
          entry.project.toLowerCase().includes(query) ||
          entry.employeeId.toLowerCase().includes(query),
      );
    }

    setFilteredEntries(filtered);
  };

  const handleApprove = (id: string) => {
    console.log(`Approving time entry with ID: ${id}`);
    // In a real application, this would update the status in the database
  };

  const handleReject = (id: string) => {
    console.log(`Rejecting time entry with ID: ${id}`);
    // In a real application, this would update the status in the database
  };

  const handleExport = () => {
    console.log("Exporting time entries to Excel");
    // In a real application, this would generate and download an Excel file
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        userName="Admin User"
        userRole="admin"
        userAvatar="https://api.dicebear.com/7.x/avataaars/svg?seed=admin"
      />

      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Manage employee time entries, approve timesheets, and generate
            reports
          </p>
        </div>

        <AdminFilters
          dateRange={dateRange}
          onDateRangeChange={handleDateRangeChange}
          selectedEmployee={selectedEmployee}
          onEmployeeChange={handleEmployeeChange}
          selectedProject={selectedProject}
          onProjectChange={handleProjectChange}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onReset={handleReset}
          onApplyFilters={handleApplyFilters}
        />

        <EmployeeTimeEntriesTable
          entries={filteredEntries}
          onApprove={handleApprove}
          onReject={handleReject}
          onExport={handleExport}
        />
      </main>
    </div>
  );
};

export default AdminPage;
