"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock } from "lucide-react"

interface DevelopmentTimeCardProps {
  totalLines: number;
}


function formatNumber(num: number): string {
    return num.toLocaleString(undefined, { maximumFractionDigits: 0 });
}

function formatHours(hours: number): string {
  const days = formatNumber((hours / 24));

  return `${days} days`;
}

export function DevelopmentTimeCard({ totalLines }: DevelopmentTimeCardProps) {
  // 50 lines per day (8 hours)
  const LINES_PER_HOUR = 50 / 8;
  const totalHours = Math.round(totalLines / LINES_PER_HOUR);

  return (
    <Card className="bg-gray-50 dark:bg-[#040113] dark:border-[#0c0339]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Development Time</CardTitle>
        <Clock className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatHours(totalHours)}</div>

      </CardContent>
      <CardFooter>
            <p className="text-xs text-muted-foreground dark:text-gray-500">* Based on average of 50 lines of code per day for projects of medium complexity, including debugging and refactoring time</p>
            </CardFooter>
    </Card>
  );
} 