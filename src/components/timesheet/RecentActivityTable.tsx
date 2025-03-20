import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/auth/AuthContext";
import { TimeEntryService } from "./TimeEntryService";

interface TimeEntry {
  id: string;
  date: string;
  project: string;
  clockIn: string;
  clockOut: string;
  breaks: string;
  totalHours: number;
}

interface RecentActivityTableProps {
  entries?: TimeEntry[];
  title?: string;
}

const RecentActivityTable = ({
  entries: propEntries,
  title = "Recent Activity",
}: RecentActivityTableProps) => {
  const { user } = useAuth();
  const [entries, setEntries] = useState(propEntries || []);
  const [isLoading, setIsLoading] = useState(!propEntries);

  useEffect(() => {
    // If entries were provided as props, use those
    if (propEntries) {
      setEntries(propEntries);
      return;
    }

    // Otherwise fetch from the service
    const fetchRecentActivity = async () => {
      if (user?.id) {
        setIsLoading(true);
        try {
          const recentEntries = await TimeEntryService.getRecentTimeEntries(
            user.id,
          );
          setEntries(recentEntries);
        } catch (error) {
          console.error("Error fetching recent activity:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchRecentActivity();
  }, [user, propEntries]);
  return (
    <Card className="w-full bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-800">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Date</TableHead>
                <TableHead className="w-[180px]">Project</TableHead>
                <TableHead className="w-[120px]">Clock In</TableHead>
                <TableHead className="w-[120px]">Clock Out</TableHead>
                <TableHead className="w-[100px]">Breaks</TableHead>
                <TableHead className="w-[100px] text-right">
                  Total Hours
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    Loading recent activity...
                  </TableCell>
                </TableRow>
              ) : entries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    No recent activity found
                  </TableCell>
                </TableRow>
              ) : (
                entries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium">{entry.date}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          "font-normal",
                          entry.project.includes("Meeting") &&
                            "bg-blue-50 text-blue-700 border-blue-200",
                          entry.project.includes("Development") &&
                            "bg-purple-50 text-purple-700 border-purple-200",
                          entry.project.includes("Redesign") &&
                            "bg-green-50 text-green-700 border-green-200",
                          entry.project.includes("Bug") &&
                            "bg-red-50 text-red-700 border-red-200",
                          entry.project.includes("Documentation") &&
                            "bg-orange-50 text-orange-700 border-orange-200",
                        )}
                      >
                        {entry.project}
                      </Badge>
                    </TableCell>
                    <TableCell>{entry.clockIn}</TableCell>
                    <TableCell>{entry.clockOut}</TableCell>
                    <TableCell>{entry.breaks}</TableCell>
                    <TableCell className="text-right">
                      <span
                        className={cn(
                          "font-medium",
                          entry.totalHours > 8 && "text-orange-600",
                          entry.totalHours < 6 && "text-blue-600",
                        )}
                      >
                        {typeof entry.totalHours === "number"
                          ? entry.totalHours.toFixed(2)
                          : "0.00"}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivityTable;
