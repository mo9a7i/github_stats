"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Code } from "lucide-react"
import { LanguageLinesStats } from "@/app/types/github"

function formatLines(lines: number): string {
  return lines.toLocaleString();
}

interface LanguageBytesCardProps {
  languages: LanguageLinesStats[];
  totalBytes: number;
}

export function LanguageBytesCard({ languages, totalBytes }: LanguageBytesCardProps) {
  return (
    <Card className="bg-gray-50 dark:bg-[#040113] dark:border-[#0c0339] col-span-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Lines of Code</CardTitle>
        <Code className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-4">{formatLines(Math.round(totalBytes / 120))} lines</div>
        <div className="space-y-4">
          {languages.map((lang) => (
            <div key={lang.name} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>{lang.name}</span>
                <span className="text-muted-foreground">
                  {formatLines(lang.lines || 0)} lines ({lang.percentage.toFixed(1)}%)
                </span>
              </div>
              <div className="h-2 rounded-full bg-gray-100 dark:bg-[#0a032d] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${lang.percentage}%`,
                    backgroundColor: lang.color
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 