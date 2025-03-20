import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";
import { Clock, Calendar, AlertCircle } from "lucide-react";

interface TimeTrackingSummaryProps {
  todayHours?: number;
  weeklyHours?: number;
  regularHours?: number;
  overtimeHours?: number;
}

const TimeTrackingSummary = ({
  todayHours = 6.5,
  weeklyHours = 32.5,
  regularHours = 30,
  overtimeHours = 2.5,
}: TimeTrackingSummaryProps) => {
  return (
    <Card className="w-full max-w-[500px] shadow-md bg-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold text-gray-800">
          Time Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-500" />
            <span className="text-sm font-medium text-gray-700">
              Today's Hours
            </span>
          </div>
          <span className="text-lg font-semibold text-gray-900">
            {todayHours} hrs
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-green-500" />
            <span className="text-sm font-medium text-gray-700">This Week</span>
          </div>
          <span className="text-lg font-semibold text-gray-900">
            {weeklyHours} hrs
          </span>
        </div>

        <Separator className="my-2" />

        <div className="pt-2">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Hours Breakdown
          </h3>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Regular Hours</span>
              <span className="text-sm font-medium text-gray-800">
                {regularHours} hrs
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="text-sm text-gray-600">Overtime</span>
                {overtimeHours > 0 && (
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                )}
              </div>
              <span
                className={`text-sm font-medium ${overtimeHours > 0 ? "text-amber-600" : "text-gray-800"}`}
              >
                {overtimeHours} hrs
              </span>
            </div>
          </div>
        </div>

        <div className="pt-2 mt-2 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Total</span>
            <span className="text-lg font-bold text-gray-900">
              {regularHours + overtimeHours} hrs
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TimeTrackingSummary;
