import React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import DatePickerWithRange from "@/components/ui/date-picker-with-range";
import { addDays } from "date-fns";
import { Search, Filter, X } from "lucide-react";

interface DateRange {
  from: Date;
  to?: Date;
}

interface AdminFiltersProps {
  dateRange?: DateRange;
  onDateRangeChange?: (range: DateRange) => void;
  selectedEmployee?: string;
  onEmployeeChange?: (employee: string) => void;
  selectedProject?: string;
  onProjectChange?: (project: string) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onReset?: () => void;
  onApplyFilters?: () => void;
}

const AdminFilters = ({
  dateRange = { from: new Date(), to: addDays(new Date(), 7) },
  onDateRangeChange = () => {},
  selectedEmployee = "",
  onEmployeeChange = () => {},
  selectedProject = "",
  onProjectChange = () => {},
  searchQuery = "",
  onSearchChange = () => {},
  onReset = () => {},
  onApplyFilters = () => {},
}: AdminFiltersProps) => {
  // Mock data for dropdowns
  const employees = [
    { id: "1", name: "John Doe" },
    { id: "2", name: "Jane Smith" },
    { id: "3", name: "Robert Johnson" },
    { id: "4", name: "Emily Davis" },
  ];

  const projects = [
    { id: "1", name: "Website Redesign" },
    { id: "2", name: "Mobile App Development" },
    { id: "3", name: "Database Migration" },
    { id: "4", name: "UI/UX Improvements" },
  ];

  return (
    <Card className="p-4 mb-6 bg-white">
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-start">
          <div className="w-full md:w-1/3">
            <Label htmlFor="date-range" className="mb-2 block">
              Date Range
            </Label>
            <DatePickerWithRange
              id="date-range"
              date={dateRange}
              onDateChange={onDateRangeChange}
              className="w-full"
            />
          </div>

          <div className="w-full md:w-1/4">
            <Label htmlFor="employee" className="mb-2 block">
              Employee
            </Label>
            <Select value={selectedEmployee} onValueChange={onEmployeeChange}>
              <SelectTrigger id="employee" className="w-full">
                <SelectValue placeholder="Select employee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Employees</SelectItem>
                {employees.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full md:w-1/4">
            <Label htmlFor="project" className="mb-2 block">
              Project
            </Label>
            <Select value={selectedProject} onValueChange={onProjectChange}>
              <SelectTrigger id="project" className="w-full">
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full md:w-1/4">
            <Label htmlFor="search" className="mb-2 block">
              Search
            </Label>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                id="search"
                type="text"
                placeholder="Search entries..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-8 w-full"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={onReset}
            className="flex items-center gap-1"
          >
            <X className="h-4 w-4" />
            Reset
          </Button>
          <Button onClick={onApplyFilters} className="flex items-center gap-1">
            <Filter className="h-4 w-4" />
            Apply Filters
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default AdminFilters;
