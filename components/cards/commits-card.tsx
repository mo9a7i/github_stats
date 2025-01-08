import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GitCommit } from "lucide-react"

interface CommitsCardProps {
  totalCommits: number;
  lastUpdated: string;
}

export function CommitsCard({ totalCommits, lastUpdated }: CommitsCardProps) {
  return (
    <Card className="bg-gray-50 dark:bg-[#040113] dark:border-[#0c0339]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Commits</CardTitle>
        <GitCommit className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{totalCommits}</div>
        <p className="text-xs text-muted-foreground">
          Last updated {new Date(lastUpdated).toLocaleDateString()}
        </p>
      </CardContent>
    </Card>
  );
} 