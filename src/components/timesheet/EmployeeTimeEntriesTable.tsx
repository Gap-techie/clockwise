import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Filter, Search } from "lucide-react";

interface TimeEntry {
  id: string;
  employeeName: string;
  employeeId: string;
  date: string;
  project: string;
  clockIn: string;
  clockOut: string;
  breaks: number;
  regularHours: number;
  overtimeHours: number;
  totalHours: number;
  status: "approved" | "pending" | "rejected";
}

interface EmployeeTimeEntriesTableProps {
  entries?: TimeEntry[];
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onExport?: () => void;
}

const EmployeeTimeEntriesTable = ({
  entries = [
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
      status: "approved",
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
      status: "pending",
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
      status: "rejected",
    },
    {
      id: "4",
      employeeName: "Emily Davis",
      employeeId: "EMP004",
      date: "2023-06-01",
      project: "Client Meeting",
      clockIn: "10:00 AM",
      clockOut: "07:00 PM",
      breaks: 30,
      regularHours: 8,
      overtimeHours: 0.5,
      totalHours: 8.5,
      status: "pending",
    },
    {
      id: "5",
      employeeName: "Michael Wilson",
      employeeId: "EMP005",
      date: "2023-06-01",
      project: "Bug Fixes",
      clockIn: "09:00 AM",
      clockOut: "08:30 PM",
      breaks: 60,
      regularHours: 8,
      overtimeHours: 2.5,
      totalHours: 10.5,
      status: "approved",
    },
  ],
  onApprove = () => {},
  onReject = () => {},
  onExport = () => {},
}: EmployeeTimeEntriesTableProps) => {
  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Employee Time Entries</h2>
        <div className="flex gap-3">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search entries..."
              className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Filter size={16} />
            <span>Filter</span>
          </Button>
          <Button
            onClick={onExport}
            variant="secondary"
            size="sm"
            className="flex items-center gap-2"
          >
            <Download size={16} />
            <span>Export</span>
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Clock In</TableHead>
              <TableHead>Clock Out</TableHead>
              <TableHead>Breaks (min)</TableHead>
              <TableHead>Regular Hours</TableHead>
              <TableHead>Overtime Hours</TableHead>
              <TableHead>Total Hours</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{entry.employeeName}</div>
                    <div className="text-xs text-gray-500">
                      {entry.employeeId}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{entry.date}</TableCell>
                <TableCell>{entry.project}</TableCell>
                <TableCell>{entry.clockIn}</TableCell>
                <TableCell>{entry.clockOut}</TableCell>
                <TableCell>{entry.breaks}</TableCell>
                <TableCell>{entry.regularHours}</TableCell>
                <TableCell>{entry.overtimeHours}</TableCell>
                <TableCell className="font-medium">
                  {entry.totalHours}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      entry.status === "approved"
                        ? "default"
                        : entry.status === "pending"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {entry.status.charAt(0).toUpperCase() +
                      entry.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {entry.status === "pending" && (
                    <div className="flex justify-end gap-2">
                      <Button
                        onClick={() => onApprove(entry.id)}
                        variant="outline"
                        size="sm"
                      >
                        Approve
                      </Button>
                      <Button
                        onClick={() => onReject(entry.id)}
                        variant="outline"
                        size="sm"
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
        <div>Showing {entries.length} entries</div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeTimeEntriesTable;
