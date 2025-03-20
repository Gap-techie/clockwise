import React, { useState, useEffect } from "react";
import Header from "./timesheet/Header";
import ClockInOutCard from "./timesheet/ClockInOutCard";
import TimeTrackingSummary from "./timesheet/TimeTrackingSummary";
import RecentActivityTable from "./timesheet/RecentActivityTable";
import { useAuth } from "./auth/AuthContext";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/use-toast";
import { calculateHours } from "@/lib/utils/exportUtils";
import { Loader2 } from "lucide-react";

interface Project {
  id: string;
  name: string;
}

interface TimeEntry {
  id: string;
  project_id: string;
  date: string;
  clock_in: string;
  clock_out: string | null;
  break_minutes: number;
}

const Home = () => {
  const { user } = useAuth();

  // State for tracking user status
  const [isActive, setIsActive] = useState(false);
  const [onBreak, setOnBreak] = useState(false);
  const [currentProject, setCurrentProject] = useState("");
  const [currentTimeEntryId, setCurrentTimeEntryId] = useState<string | null>(
    null,
  );
  const [currentBreakId, setCurrentBreakId] = useState<string | null>(null);

  // State for data
  const [projects, setProjects] = useState<Project[]>([]);
  const [timeTrackingData, setTimeTrackingData] = useState({
    todayHours: 0,
    weeklyHours: 0,
    regularHours: 0,
    overtimeHours: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchProjects();
      checkActiveTimeEntry();
      fetchTimeTrackingData();
    }
  }, [user]);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("id, name")
        .order("name");

      if (error) throw error;
      setProjects(data || []);
    } catch (error: any) {
      console.error("Error fetching projects:", error);
      toast({
        title: "Error",
        description: "Failed to load projects",
        variant: "destructive",
      });
    }
  };

  const checkActiveTimeEntry = async () => {
    if (!user?.id) return;

    try {
      // Check for an active time entry (no clock_out)
      const { data: timeEntryData, error: timeEntryError } = await supabase
        .from("time_entries")
        .select("id, project_id, clock_in")
        .eq("user_id", user.id)
        .is("clock_out", null)
        .order("clock_in", { ascending: false })
        .limit(1)
        .single();

      if (timeEntryError && timeEntryError.code !== "PGRST116") {
        // PGRST116 is the error code for no rows returned
        throw timeEntryError;
      }

      if (timeEntryData) {
        setIsActive(true);
        setCurrentProject(timeEntryData.project_id);
        setCurrentTimeEntryId(timeEntryData.id);

        // Check if on break
        const { data: breakData, error: breakError } = await supabase
          .from("breaks")
          .select("id")
          .eq("time_entry_id", timeEntryData.id)
          .is("end_time", null)
          .single();

        if (breakError && breakError.code !== "PGRST116") {
          throw breakError;
        }

        if (breakData) {
          setOnBreak(true);
          setCurrentBreakId(breakData.id);
        }
      }
    } catch (error) {
      console.error("Error checking active time entry:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTimeTrackingData = async () => {
    if (!user?.id) return;

    try {
      // Get today's date in ISO format (YYYY-MM-DD)
      const today = new Date().toISOString().split("T")[0];

      // Get the start of the current week (Sunday)
      const now = new Date();
      const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - dayOfWeek);
      const weekStart = startOfWeek.toISOString().split("T")[0];

      // Fetch completed time entries for today
      const { data: todayEntries, error: todayError } = await supabase
        .from("time_entries")
        .select("*")
        .eq("user_id", user.id)
        .eq("date", today)
        .not("clock_out", "is", null);

      if (todayError) throw todayError;

      // Fetch completed time entries for this week
      const { data: weekEntries, error: weekError } = await supabase
        .from("time_entries")
        .select("*")
        .eq("user_id", user.id)
        .gte("date", weekStart)
        .not("clock_out", "is", null);

      if (weekError) throw weekError;

      // Calculate hours
      let todayHours = 0;
      let weeklyHours = 0;
      let regularHours = 0;
      let overtimeHours = 0;

      todayEntries?.forEach((entry) => {
        if (entry.clock_in && entry.clock_out) {
          const hours = calculateHours(
            entry.clock_in,
            entry.clock_out,
            entry.break_minutes,
          );
          todayHours += hours.totalHours;
          regularHours += hours.regularHours;
          overtimeHours += hours.overtimeHours;
        }
      });

      weekEntries?.forEach((entry) => {
        if (entry.clock_in && entry.clock_out) {
          const hours = calculateHours(
            entry.clock_in,
            entry.clock_out,
            entry.break_minutes,
          );
          weeklyHours += hours.totalHours;
        }
      });

      setTimeTrackingData({
        todayHours: parseFloat(todayHours.toFixed(2)),
        weeklyHours: parseFloat(weeklyHours.toFixed(2)),
        regularHours: parseFloat(regularHours.toFixed(2)),
        overtimeHours: parseFloat(overtimeHours.toFixed(2)),
      });
    } catch (error) {
      console.error("Error fetching time tracking data:", error);
    }
  };

  // Handler functions
  const handleClockIn = async (projectId: string) => {
    if (!user?.id) return;

    try {
      const now = new Date();
      const today = now.toISOString().split("T")[0];

      // Create a new time entry
      const { data, error } = await supabase
        .from("time_entries")
        .insert({
          user_id: user.id,
          project_id: projectId,
          date: today,
          clock_in: now.toISOString(),
          break_minutes: 0,
        })
        .select()
        .single();

      if (error) throw error;

      setCurrentTimeEntryId(data.id);
      setCurrentProject(projectId);
      setIsActive(true);
      setOnBreak(false);

      toast({
        title: "Clocked In",
        description: `You are now clocked in to ${projects.find((p) => p.id === projectId)?.name || "project"}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to clock in",
        variant: "destructive",
      });
    }
  };

  const handleClockOut = async () => {
    if (!currentTimeEntryId || !user?.id) return;

    try {
      // If on break, end the break first
      if (onBreak && currentBreakId) {
        await handleBreakEnd();
      }

      const now = new Date().toISOString();

      // Update the time entry with clock out time
      const { error } = await supabase
        .from("time_entries")
        .update({
          clock_out: now,
          updated_at: now,
        })
        .eq("id", currentTimeEntryId);

      if (error) throw error;

      setIsActive(false);
      setOnBreak(false);
      setCurrentTimeEntryId(null);
      setCurrentProject("");

      // Refresh time tracking data
      fetchTimeTrackingData();

      toast({
        title: "Clocked Out",
        description: "You have successfully clocked out",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to clock out",
        variant: "destructive",
      });
    }
  };

  const handleBreakStart = async () => {
    if (!currentTimeEntryId) return;

    try {
      const now = new Date().toISOString();

      // Create a new break record
      const { data, error } = await supabase
        .from("breaks")
        .insert({
          time_entry_id: currentTimeEntryId,
          start_time: now,
        })
        .select()
        .single();

      if (error) throw error;

      setOnBreak(true);
      setCurrentBreakId(data.id);

      toast({
        title: "Break Started",
        description: "Your break has been started",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to start break",
        variant: "destructive",
      });
    }
  };

  const handleBreakEnd = async () => {
    if (!currentBreakId || !currentTimeEntryId) return;

    try {
      const now = new Date().toISOString();

      // Get the break start time
      const { data: breakData, error: breakFetchError } = await supabase
        .from("breaks")
        .select("start_time")
        .eq("id", currentBreakId)
        .single();

      if (breakFetchError) throw breakFetchError;

      // Update the break record with end time
      const { error: breakUpdateError } = await supabase
        .from("breaks")
        .update({
          end_time: now,
          updated_at: now,
        })
        .eq("id", currentBreakId);

      if (breakUpdateError) throw breakUpdateError;

      // Calculate break duration in minutes
      const startTime = new Date(breakData.start_time).getTime();
      const endTime = new Date(now).getTime();
      const breakMinutes = Math.round((endTime - startTime) / (1000 * 60));

      // Update the time entry with additional break minutes
      const { data: timeEntryData, error: timeEntryFetchError } = await supabase
        .from("time_entries")
        .select("break_minutes")
        .eq("id", currentTimeEntryId)
        .single();

      if (timeEntryFetchError) throw timeEntryFetchError;

      const totalBreakMinutes =
        (timeEntryData.break_minutes || 0) + breakMinutes;

      const { error: timeEntryUpdateError } = await supabase
        .from("time_entries")
        .update({
          break_minutes: totalBreakMinutes,
          updated_at: now,
        })
        .eq("id", currentTimeEntryId);

      if (timeEntryUpdateError) throw timeEntryUpdateError;

      setOnBreak(false);
      setCurrentBreakId(null);

      toast({
        title: "Break Ended",
        description: `Break duration: ${breakMinutes} minutes`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to end break",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header
          userName={user?.name || "User"}
          userRole={(user?.role as "employee" | "admin") || "employee"}
          userAvatar={user?.avatar_url || ""}
        />
        <div className="flex justify-center items-center h-[calc(100vh-5rem)]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        userName={user?.name || "User"}
        userRole={(user?.role as "employee" | "admin") || "employee"}
        userAvatar={user?.avatar_url || ""}
      />
      <div className="container mx-auto py-6 px-4 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <ClockInOutCard
              isActive={isActive}
              onBreak={onBreak}
              projects={projects}
              currentProject={currentProject}
              onClockIn={handleClockIn}
              onClockOut={handleClockOut}
              onBreakStart={handleBreakStart}
              onBreakEnd={handleBreakEnd}
            />
          </div>
          <div className="md:col-span-2">
            <TimeTrackingSummary
              todayHours={timeTrackingData.todayHours}
              weeklyHours={timeTrackingData.weeklyHours}
              regularHours={timeTrackingData.regularHours}
              overtimeHours={timeTrackingData.overtimeHours}
            />
          </div>
        </div>
        <RecentActivityTable userId={user?.id || ""} />
      </div>
    </div>
  );
};

export default Home;
