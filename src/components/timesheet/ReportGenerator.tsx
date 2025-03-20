import React, { useState } from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";
import DatePickerWithRange from "../ui/date-picker-with-range";
import { Checkbox } from "../ui/checkbox";
import { ScrollArea } from "../ui/scroll-area";
import { cn } from "@/lib/utils";
import { Download, FileSpreadsheet, RefreshCw } from "lucide-react";
import { addDays } from "date-fns";

interface DateRange {
  from: Date;
  to?: Date;
}

interface Employee {
  id: string;
  name: string;
}

interface Project {
  id: string;
  name: string;
}

interface ReportGeneratorProps {
  onGenerate?: (params: {
    dateRange: DateRange;
    employees: string[];
    projects: string[];
  }) => void;
  onExport?: () => void;
  isLoading?: boolean;
  employees?: Employee[];
  projects?: Project[];
}

const ReportGenerator = ({
  onGenerate = () => {},
  onExport = () => {},
  isLoading = false,
  employees = [
    { id: "1", name: "John Doe" },
    { id: "2", name: "Jane Smith" },
    { id: "3", name: "Michael Johnson" },
    { id: "4", name: "Emily Williams" },
    { id: "5", name: "Robert Brown" },
  ],
  projects = [
    { id: "1", name: "Website Redesign" },
    { id: "2", name: "Mobile App Development" },
    { id: "3", name: "Database Migration" },
    { id: "4", name: "Marketing Campaign" },
    { id: "5", name: "Internal Training" },
  ],
}: ReportGeneratorProps) => {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });
  const [reportType, setReportType] = useState<string>("detailed");
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [selectAllEmployees, setSelectAllEmployees] = useState(false);
  const [selectAllProjects, setSelectAllProjects] = useState(false);

  const handleEmployeeChange = (employeeId: string) => {
    setSelectedEmployees((prev) =>
      prev.includes(employeeId)
        ? prev.filter((id) => id !== employeeId)
        : [...prev, employeeId],
    );
  };

  const handleProjectChange = (projectId: string) => {
    setSelectedProjects((prev) =>
      prev.includes(projectId)
        ? prev.filter((id) => id !== projectId)
        : [...prev, projectId],
    );
  };

  const handleSelectAllEmployees = () => {
    if (selectAllEmployees) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(employees.map((emp) => emp.id));
    }
    setSelectAllEmployees(!selectAllEmployees);
  };

  const handleSelectAllProjects = () => {
    if (selectAllProjects) {
      setSelectedProjects([]);
    } else {
      setSelectedProjects(projects.map((proj) => proj.id));
    }
    setSelectAllProjects(!selectAllProjects);
  };

  const handleGenerateReport = () => {
    onGenerate({
      dateRange,
      employees: selectedEmployees,
      projects: selectedProjects,
    });
  };

  return (
    <Card className="w-full bg-white shadow-md">
      <CardHeader>
        <CardTitle>Generate Report</CardTitle>
        <CardDescription>
          Select parameters to generate a timesheet report
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="date-range">Date Range</Label>
            <DatePickerWithRange
              date={dateRange}
              setDate={setDateRange}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="report-type">Report Type</Label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger id="report-type" className="w-full">
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="detailed">Detailed Report</SelectItem>
                <SelectItem value="summary">Summary Report</SelectItem>
                <SelectItem value="payroll">Payroll Report</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Employees</Label>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="select-all-employees"
                  checked={selectAllEmployees}
                  onCheckedChange={handleSelectAllEmployees}
                />
                <label
                  htmlFor="select-all-employees"
                  className="text-sm font-medium cursor-pointer"
                >
                  Select All
                </label>
              </div>
            </div>
            <ScrollArea className="h-40 border rounded-md p-2">
              <div className="space-y-2">
                {employees.map((employee) => (
                  <div
                    key={employee.id}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`employee-${employee.id}`}
                      checked={selectedEmployees.includes(employee.id)}
                      onCheckedChange={() => handleEmployeeChange(employee.id)}
                    />
                    <label
                      htmlFor={`employee-${employee.id}`}
                      className="text-sm font-medium cursor-pointer"
                    >
                      {employee.name}
                    </label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Projects</Label>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="select-all-projects"
                  checked={selectAllProjects}
                  onCheckedChange={handleSelectAllProjects}
                />
                <label
                  htmlFor="select-all-projects"
                  className="text-sm font-medium cursor-pointer"
                >
                  Select All
                </label>
              </div>
            </div>
            <ScrollArea className="h-40 border rounded-md p-2">
              <div className="space-y-2">
                {projects.map((project) => (
                  <div key={project.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`project-${project.id}`}
                      checked={selectedProjects.includes(project.id)}
                      onCheckedChange={() => handleProjectChange(project.id)}
                    />
                    <label
                      htmlFor={`project-${project.id}`}
                      className="text-sm font-medium cursor-pointer"
                    >
                      {project.name}
                    </label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={onExport}
          className="flex items-center gap-2"
        >
          <FileSpreadsheet className="h-4 w-4" />
          Export to Excel
        </Button>
        <Button
          onClick={handleGenerateReport}
          className={cn("flex items-center gap-2", {
            "opacity-70 cursor-not-allowed": isLoading,
          })}
          disabled={isLoading}
        >
          {isLoading ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          Generate Report
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ReportGenerator;
