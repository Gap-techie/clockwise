import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Badge } from "../ui/badge";
import { Clock, Play, Pause, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/use-toast";

interface ClockInOutCardProps {
  isActive?: boolean;
  currentProject?: string;
  onBreak?: boolean;
  projects?: { id: string; name: string }[];
  onClockIn?: (projectId: string) => void;
  onClockOut?: () => void;
  onBreakStart?: () => void;
  onBreakEnd?: () => void;
}

const ClockInOutCard = ({
  isActive = false,
  currentProject = "",
  onBreak = false,
  projects = [],
  onClockIn = () => {},
  onClockOut = () => {},
  onBreakStart = () => {},
  onBreakEnd = () => {},
}: ClockInOutCardProps) => {
  const [selectedProject, setSelectedProject] = useState(currentProject || "");
  const [projectsList, setProjectsList] = useState(projects);

  useEffect(() => {
    // Fetch projects from Supabase if none were provided
    if (projects.length === 0) {
      const fetchProjects = async () => {
        try {
          const { data, error } = await supabase
            .from("projects")
            .select("id, name")
            .order("name");

          if (error) throw error;
          setProjectsList(data || []);
        } catch (error: any) {
          console.error("Error fetching projects:", error.message);
        }
      };

      fetchProjects();
    } else {
      setProjectsList(projects);
    }
  }, [projects]);

  // Get current time for display
  const [currentTime, setCurrentTime] = useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const handleClockIn = () => {
    if (selectedProject) {
      onClockIn(selectedProject);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-white shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span className="text-xl font-bold">Time Tracker</span>
          <div className="text-lg font-medium">{formattedTime}</div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Status Display */}
          <div className="flex items-center justify-center py-4">
            <Badge
              className={cn(
                "text-lg py-2 px-4",
                isActive
                  ? onBreak
                    ? "bg-yellow-500 hover:bg-yellow-600"
                    : "bg-green-500 hover:bg-green-600"
                  : "bg-gray-500 hover:bg-gray-600",
              )}
            >
              <Clock className="mr-2 h-5 w-5" />
              {isActive ? (onBreak ? "On Break" : "Clocked In") : "Clocked Out"}
            </Badge>
          </div>

          {/* Project Selection (only shown when clocked out) */}
          {!isActive && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Project</label>
              <Select
                value={selectedProject}
                onValueChange={setSelectedProject}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  {projectsList.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Current Project Display (only shown when clocked in) */}
          {isActive && (
            <div className="py-2 px-4 bg-gray-100 rounded-md">
              <p className="text-sm text-gray-500">Current Project</p>
              <p className="font-medium">
                {projectsList.find((p) => p.id === currentProject)?.name ||
                  "Unknown Project"}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col space-y-3">
            {!isActive ? (
              <Button
                size="lg"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleClockIn}
                disabled={!selectedProject}
              >
                <Clock className="mr-2 h-5 w-5" />
                Clock In
              </Button>
            ) : (
              <div className="space-y-3">
                {onBreak ? (
                  <Button
                    size="lg"
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    onClick={onBreakEnd}
                  >
                    <Play className="mr-2 h-5 w-5" />
                    Resume Work
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
                    onClick={onBreakStart}
                  >
                    <Pause className="mr-2 h-5 w-5" />
                    Take a Break
                  </Button>
                )}

                <Button
                  size="lg"
                  variant="outline"
                  className="w-full border-red-500 text-red-500 hover:bg-red-50"
                  onClick={onClockOut}
                >
                  <LogOut className="mr-2 h-5 w-5" />
                  Clock Out
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClockInOutCard;
