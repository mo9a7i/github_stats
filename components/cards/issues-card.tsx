import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

interface IssuesCardProps {
  totalIssues: number;
}

export function IssuesCard({ totalIssues }: IssuesCardProps) {
  return (
    <Card className="bg-gray-50 dark:bg-[#040113] dark:border-[#0c0339]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Issues</CardTitle>
        <AlertCircle className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{totalIssues}</div>
        <p className="text-xs text-muted-foreground">
          Open issues
        </p>
      </CardContent>
    </Card>
  );
} 