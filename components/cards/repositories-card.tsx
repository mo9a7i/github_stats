"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GitBranch } from "lucide-react"

interface RepositoriesCardProps {
  totalRepos: number;
  publicRepos: number;
  privateRepos: number;
}

export function RepositoriesCard({ totalRepos, publicRepos, privateRepos }: RepositoriesCardProps) {
  return (
    <Card className="bg-gray-50 dark:bg-[#040113] dark:border-[#0c0339]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Repositories</CardTitle>
        <GitBranch className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-5xl font-bold" suppressHydrationWarning>{totalRepos}</div>
        <p className="text-xs text-muted-foreground">
          <span suppressHydrationWarning>{publicRepos} public, {privateRepos} private</span>
        </p>
      </CardContent>
    </Card>
  );
} 