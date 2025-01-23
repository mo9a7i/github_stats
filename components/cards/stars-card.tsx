import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Star } from "lucide-react"

interface StarsCardProps {
  totalStars: number;
}

export function StarsCard({ totalStars }: StarsCardProps) {
  return (
    <Card className="bg-gray-50 dark:bg-[#040113] dark:border-[#0c0339]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Stars</CardTitle>
        <Star className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-5xl font-bold">{totalStars}</div>
        <p className="text-xs text-muted-foreground">
          Across all repositories
        </p>
      </CardContent>
    </Card>
  );
} 