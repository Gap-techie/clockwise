import React, { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Download, FileSpreadsheet, Printer } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimeEntry {
  id: string;
  employeeName: string;
  date: string;
  project: string;
  regularHours: number;
  overtimeHours: number;
  totalHours: number;
}

interface ReportDisplayProps {
  title?: string;
  dateRange?: { from: Date; to: Date };
  entries?: TimeEntry[];
  isLoading?: boolean;
  onExport?: () => void;
  onPrint?: () => void;
}

const ReportDisplay = ({
  title = "Time Tracking Report",
  dateRange = { from: new Date(2023, 5, 1), to: new Date(2023, 5, 30) },
  entries = [
    {
      id: "1",
      employeeName: "John Doe",
      date: "2023-06-01",
      project: "Website Redesign",
      regularHours: 7.5,
      overtimeHours: 1.5,
      totalHours: 9.0,
    },
    {
      id: "2",
      employeeName: "Jane Smith",
      date: "2023-06-01",
      project: "Mobile App Development",
      regularHours: 8.0,
      overtimeHours: 0,
      totalHours: 8.0,
    },
    {
      id: "3",
      employeeName: "John Doe",
      date: "2023-06-02",
      project: "Website Redesign",
      regularHours: 8.0,
      overtimeHours: 0,
      totalHours: 8.0,
    },
    {
      id: "4",
      employeeName: "Jane Smith",
      date: "2023-06-02",
      project: "Mobile App Development",
      regularHours: 7.0,
      overtimeHours: 2.0,
      totalHours: 9.0,
    },
    {
      id: "5",
      employeeName: "Alex Johnson",
      date: "2023-06-02",
      project: "Database Migration",
      regularHours: 8.0,
      overtimeHours: 3.5,
      totalHours: 11.5,
    },
  ],
  isLoading = false,
  onExport = () => console.log("Exporting to Excel..."),
  onPrint = () => console.log("Printing report..."),
}: ReportDisplayProps) => {
  const [sortColumn, setSortColumn] = useState<keyof TimeEntry>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSort = (column: keyof TimeEntry) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const sortedEntries = [...entries].sort((a, b) => {
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    }

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return 0;
  });

  // Calculate totals
  const totalRegularHours = entries.reduce(
    (sum, entry) => sum + entry.regularHours,
    0,
  );
  const totalOvertimeHours = entries.reduce(
    (sum, entry) => sum + entry.overtimeHours,
    0,
  );
  const totalHours = entries.reduce((sum, entry) => sum + entry.totalHours, 0);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <Card className="w-full bg-white shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold">{title}</CardTitle>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
            className="flex items-center gap-1"
          >
            <FileSpreadsheet className="h-4 w-4" />
            Export to Excel
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onPrint}
            className="flex items-center gap-1"
          >
            <Printer className="h-4 w-4" />
            Print
          </Button>
          <Button
            variant="default"
            size="sm"
            className="flex items-center gap-1"
          >
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p className="text-sm text-gray-500">
            Report Period: {dateRange.from.toLocaleDateString()} -{" "}
            {dateRange.to.toLocaleDateString()}
          </p>
        </div>

        {isLoading ? (
          <div className="flex h-60 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    className={cn(
                      "cursor-pointer hover:bg-gray-50",
                      sortColumn === "employeeName" && "bg-gray-50",
                    )}
                    onClick={() => handleSort("employeeName")}
                  >
                    Employee
                    {sortColumn === "employeeName" && (
                      <span className="ml-1">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </TableHead>
                  <TableHead
                    className={cn(
                      "cursor-pointer hover:bg-gray-50",
                      sortColumn === "date" && "bg-gray-50",
                    )}
                    onClick={() => handleSort("date")}
                  >
                    Date
                    {sortColumn === "date" && (
                      <span className="ml-1">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </TableHead>
                  <TableHead
                    className={cn(
                      "cursor-pointer hover:bg-gray-50",
                      sortColumn === "project" && "bg-gray-50",
                    )}
                    onClick={() => handleSort("project")}
                  >
                    Project
                    {sortColumn === "project" && (
                      <span className="ml-1">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </TableHead>
                  <TableHead
                    className={cn(
                      "cursor-pointer hover:bg-gray-50 text-right",
                      sortColumn === "regularHours" && "bg-gray-50",
                    )}
                    onClick={() => handleSort("regularHours")}
                  >
                    Regular Hours
                    {sortColumn === "regularHours" && (
                      <span className="ml-1">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </TableHead>
                  <TableHead
                    className={cn(
                      "cursor-pointer hover:bg-gray-50 text-right",
                      sortColumn === "overtimeHours" && "bg-gray-50",
                    )}
                    onClick={() => handleSort("overtimeHours")}
                  >
                    Overtime Hours
                    {sortColumn === "overtimeHours" && (
                      <span className="ml-1">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </TableHead>
                  <TableHead
                    className={cn(
                      "cursor-pointer hover:bg-gray-50 text-right",
                      sortColumn === "totalHours" && "bg-gray-50",
                    )}
                    onClick={() => handleSort("totalHours")}
                  >
                    Total Hours
                    {sortColumn === "totalHours" && (
                      <span className="ml-1">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedEntries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium">
                      {entry.employeeName}
                    </TableCell>
                    <TableCell>{formatDate(entry.date)}</TableCell>
                    <TableCell>{entry.project}</TableCell>
                    <TableCell className="text-right">
                      {entry.regularHours.toFixed(1)}
                    </TableCell>
                    <TableCell className="text-right">
                      {entry.overtimeHours.toFixed(1)}
                    </TableCell>
                    <TableCell className="text-right">
                      {entry.totalHours.toFixed(1)}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-gray-50 font-semibold">
                  <TableCell colSpan={3} className="text-right">
                    Totals:
                  </TableCell>
                  <TableCell className="text-right">
                    {totalRegularHours.toFixed(1)}
                  </TableCell>
                  <TableCell className="text-right">
                    {totalOvertimeHours.toFixed(1)}
                  </TableCell>
                  <TableCell className="text-right">
                    {totalHours.toFixed(1)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReportDisplay;
