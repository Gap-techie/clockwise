import React, { useState, useEffect } from "react";
import Header from "@/components/timesheet/Header";
import EmployeeRegistration from "@/components/admin/EmployeeRegistration";
import ProjectManagement from "@/components/admin/ProjectManagement";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/components/auth/AuthContext";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/use-toast";
import {
  Search,
  UserPlus,
  Mail,
  Download,
  FileText,
  Briefcase,
} from "lucide-react";
import { format } from "date-fns";
import { exportToCSV } from "@/lib/utils/exportUtils";

interface Employee {
  id: string;
  name: string;
  email: string;
  employee_id: string;
  role: string;
  created_at: string;
}

const EmployeesPage = () => {
  const { user } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showRegistration, setShowRegistration] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .order("name");

      if (error) throw error;
      setEmployees(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load employees",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.employee_id.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const exportToExcel = () => {
    // Create CSV content
    const headers = ["Name", "Email", "Employee ID", "Role", "Created At"];
    const csvRows = [
      headers.join(","),
      ...filteredEmployees.map((employee) => {
        const formattedDate = format(
          new Date(employee.created_at),
          "yyyy-MM-dd",
        );
        return [
          `"${employee.name}"`,
          `"${employee.email}"`,
          `"${employee.employee_id}"`,
          `"${employee.role}"`,
          `"${formattedDate}"`,
        ].join(",");
      }),
    ];
    const csvContent = csvRows.join("\n");

    // Create and download the file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `employees_${format(new Date(), "yyyy-MM-dd")}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    try {
      // Create a simple PDF using browser print functionality
      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        throw new Error(
          "Unable to open print window. Please check your popup settings.",
        );
      }

      printWindow.document.write(`
        <html>
          <head>
            <title>Employees Report - ${format(new Date(), "yyyy-MM-dd")}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              table { width: 100%; border-collapse: collapse; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
              h1 { color: #333; }
              .footer { margin-top: 30px; font-size: 12px; color: #666; }
            </style>
          </head>
          <body>
            <h1>Employees Report</h1>
            <p>Generated on: ${format(new Date(), "MMMM d, yyyy 'at' h:mm a")}</p>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Employee ID</th>
                  <th>Role</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                ${filteredEmployees
                  .map(
                    (employee) => `
                  <tr>
                    <td>${employee.name}</td>
                    <td>${employee.email || ""}</td>
                    <td>${employee.employee_id || ""}</td>
                    <td>${employee.role}</td>
                    <td>${format(new Date(employee.created_at), "MMM d, yyyy")}</td>
                  </tr>
                `,
                  )
                  .join("")}
              </tbody>
            </table>
            <div class="footer">
              <p>ClockWise Time Tracking System - Confidential</p>
            </div>
          </body>
        </html>
      `);

      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 500);

      toast({
        title: "PDF Export",
        description: "PDF report generated successfully",
      });
    } catch (error: any) {
      toast({
        title: "PDF Export Failed",
        description: error.message || "Failed to generate PDF",
        variant: "destructive",
      });
    }
  };

  const sendEmailToAll = () => {
    // In a real application, this would send emails through a backend service
    // For this demo, we'll simulate the email sending process

    toast({
      title: "Email Notification",
      description:
        "Emails would be sent to all employees in a production environment",
    });
  };

  const sendEmailToEmployee = (
    employee: Employee,
    type: "credentials" | "timesheet",
  ) => {
    try {
      // In a real application, this would send an email through a backend service
      // For this demo, we'll simulate the email sending process

      const emailType =
        type === "credentials" ? "account credentials" : "timesheet report";

      toast({
        title: "Email Sent",
        description: `Email with ${emailType} would be sent to ${employee.name} in a production environment`,
      });
    } catch (error: any) {
      toast({
        title: "Email Failed",
        description: error.message || "Failed to send email",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        userName={user?.name || "Admin User"}
        userRole="admin"
        userAvatar={user?.avatar_url || ""}
      />

      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Employee Management
          </h1>
          <p className="text-gray-600 mt-2">
            Register new employees and manage existing ones
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="bg-white shadow-md">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                  <div className="relative w-full md:w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Search employees..."
                      value={searchQuery}
                      onChange={handleSearch}
                      className="pl-8"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={exportToExcel}
                    >
                      <Download className="h-4 w-4" />
                      Excel
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={exportToPDF}
                    >
                      <FileText className="h-4 w-4" />
                      PDF
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={sendEmailToAll}
                    >
                      <Mail className="h-4 w-4" />
                      Email All
                    </Button>
                    <Button
                      size="sm"
                      className="flex items-center gap-1 md:hidden"
                      onClick={() => setShowRegistration(!showRegistration)}
                    >
                      <UserPlus className="h-4 w-4" />
                      {showRegistration ? "Hide Form" : "Add Employee"}
                    </Button>
                  </div>
                </div>

                {showRegistration && (
                  <div className="mb-6 md:hidden">
                    <EmployeeRegistration />
                  </div>
                )}

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600">
                          Name
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600">
                          Email
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600">
                          Employee ID
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600">
                          Role
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600">
                          Joined
                        </th>
                        <th className="text-right py-3 px-4 font-semibold text-sm text-gray-600">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoading ? (
                        <tr>
                          <td
                            colSpan={5}
                            className="text-center py-4 text-gray-500"
                          >
                            Loading employees...
                          </td>
                        </tr>
                      ) : filteredEmployees.length === 0 ? (
                        <tr>
                          <td
                            colSpan={5}
                            className="text-center py-4 text-gray-500"
                          >
                            No employees found
                          </td>
                        </tr>
                      ) : (
                        filteredEmployees.map((employee) => (
                          <tr
                            key={employee.id}
                            className="border-b border-gray-100 hover:bg-gray-50"
                          >
                            <td className="py-3 px-4">{employee.name}</td>
                            <td className="py-3 px-4">{employee.email}</td>
                            <td className="py-3 px-4">
                              {employee.employee_id}
                            </td>
                            <td className="py-3 px-4 capitalize">
                              {employee.role}
                            </td>
                            <td className="py-3 px-4">
                              {format(
                                new Date(employee.created_at),
                                "MMM d, yyyy",
                              )}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex justify-end space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                                  onClick={() =>
                                    sendEmailToEmployee(employee, "credentials")
                                  }
                                >
                                  <Mail className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-green-500 hover:text-green-700 hover:bg-green-50"
                                  onClick={() =>
                                    sendEmailToEmployee(employee, "timesheet")
                                  }
                                >
                                  <FileText className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="hidden lg:block space-y-6">
            <EmployeeRegistration />
            <ProjectManagement />
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmployeesPage;
