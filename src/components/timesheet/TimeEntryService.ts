import { supabase } from "@/lib/supabase";
import { format } from "date-fns";

export interface TimeEntry {
  id?: string;
  user_id: string;
  project_id: string;
  date: string;
  clock_in: string;
  clock_out?: string | null;
  break_minutes?: number | null;
  notes?: string | null;
  status?: string;
}

export interface Break {
  id?: string;
  time_entry_id: string;
  start_time: string;
  end_time?: string | null;
}

export const TimeEntryService = {
  async clockIn(userId: string, projectId: string): Promise<TimeEntry | null> {
    try {
      const now = new Date();
      const todayDate = format(now, "yyyy-MM-dd");
      const currentTime = now.toISOString();

      // Check if there's already an active time entry for this user
      const { data: existingEntries, error: checkError } = await supabase
        .from("time_entries")
        .select("*")
        .eq("user_id", userId)
        .eq("date", todayDate)
        .is("clock_out", null);

      if (checkError) throw checkError;

      if (existingEntries && existingEntries.length > 0) {
        return existingEntries[0];
      }

      // Create a new time entry
      const { data, error } = await supabase
        .from("time_entries")
        .insert({
          user_id: userId,
          project_id: projectId,
          date: todayDate,
          clock_in: currentTime,
          status: "pending",
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error in clockIn:", error);
      return null;
    }
  },

  async clockOut(timeEntryId: string): Promise<TimeEntry | null> {
    try {
      const now = new Date().toISOString();

      // Update the time entry with clock out time
      const { data, error } = await supabase
        .from("time_entries")
        .update({
          clock_out: now,
        })
        .eq("id", timeEntryId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error in clockOut:", error);
      return null;
    }
  },

  async startBreak(timeEntryId: string): Promise<Break | null> {
    try {
      const now = new Date().toISOString();

      // Create a new break record
      const { data, error } = await supabase
        .from("breaks")
        .insert({
          time_entry_id: timeEntryId,
          start_time: now,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error in startBreak:", error);
      return null;
    }
  },

  async endBreak(breakId: string): Promise<Break | null> {
    try {
      const now = new Date().toISOString();

      // Update the break record with end time
      const { data, error } = await supabase
        .from("breaks")
        .update({
          end_time: now,
        })
        .eq("id", breakId)
        .select()
        .single();

      if (error) throw error;

      // Calculate break duration and update time entry
      if (data) {
        const startTime = new Date(data.start_time).getTime();
        const endTime = new Date(data.end_time || now).getTime();
        const breakMinutes = Math.round((endTime - startTime) / (1000 * 60));

        // Get the current break_minutes value
        const { data: timeEntry, error: fetchError } = await supabase
          .from("time_entries")
          .select("break_minutes")
          .eq("id", data.time_entry_id)
          .single();

        if (fetchError) throw fetchError;

        // Update the time entry with the new break minutes
        const currentBreakMinutes = timeEntry.break_minutes || 0;
        const totalBreakMinutes = currentBreakMinutes + breakMinutes;

        const { error: updateError } = await supabase
          .from("time_entries")
          .update({
            break_minutes: totalBreakMinutes,
          })
          .eq("id", data.time_entry_id);

        if (updateError) throw updateError;
      }

      return data;
    } catch (error) {
      console.error("Error in endBreak:", error);
      return null;
    }
  },

  async getActiveTimeEntry(userId: string): Promise<TimeEntry | null> {
    try {
      const todayDate = format(new Date(), "yyyy-MM-dd");

      // Get the active time entry for today
      const { data, error } = await supabase
        .from("time_entries")
        .select("*")
        .eq("user_id", userId)
        .eq("date", todayDate)
        .is("clock_out", null)
        .single();

      if (error && error.code !== "PGRST116") throw error; // PGRST116 is the error code for no rows returned

      return data || null;
    } catch (error) {
      console.error("Error in getActiveTimeEntry:", error);
      return null;
    }
  },

  async getActiveBreak(timeEntryId: string): Promise<Break | null> {
    try {
      // Get the active break
      const { data, error } = await supabase
        .from("breaks")
        .select("*")
        .eq("time_entry_id", timeEntryId)
        .is("end_time", null)
        .single();

      if (error && error.code !== "PGRST116") throw error;

      return data || null;
    } catch (error) {
      console.error("Error in getActiveBreak:", error);
      return null;
    }
  },

  async getRecentTimeEntries(userId: string, limit = 5): Promise<any[]> {
    try {
      // Get recent time entries with project information
      const { data, error } = await supabase
        .from("time_entries")
        .select(
          `
          id,
          date,
          clock_in,
          clock_out,
          break_minutes,
          projects(name)
        `,
        )
        .eq("user_id", userId)
        .order("date", { ascending: false })
        .limit(limit);

      if (error) throw error;

      // Format the data for display
      return (data || []).map((entry) => {
        const clockIn = new Date(entry.clock_in);
        const clockOut = entry.clock_out ? new Date(entry.clock_out) : null;

        // Calculate total hours
        let totalHours = 0;
        if (clockOut) {
          const diffMs = clockOut.getTime() - clockIn.getTime();
          const breakMs = (entry.break_minutes || 0) * 60 * 1000;
          totalHours = (diffMs - breakMs) / (1000 * 60 * 60);
        }

        return {
          id: entry.id,
          date: format(new Date(entry.date), "yyyy-MM-dd"),
          project: entry.projects?.name || "Unknown Project",
          clockIn: format(clockIn, "hh:mm a"),
          clockOut: clockOut ? format(clockOut, "hh:mm a") : "-",
          breaks: entry.break_minutes
            ? `${Math.floor(entry.break_minutes / 60)}h ${entry.break_minutes % 60}m`
            : "0m",
          totalHours: totalHours,
        };
      });
    } catch (error) {
      console.error("Error in getRecentTimeEntries:", error);
      return [];
    }
  },
};
