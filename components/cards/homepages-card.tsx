"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Globe, GitFork } from "lucide-react"
import Link from "next/link"

interface Homepage {
  name: string;
  url: string;
  isGitHubPages: boolean;
  orgName: string;
  isFork: boolean;
}

interface HomepagesCardProps {
  homepages: Homepage[];
}

export function HomepagesCard({ homepages }: HomepagesCardProps) {
  const groupedHomepages = homepages.reduce((acc, homepage) => {
    if (!acc[homepage.orgName]) {
      acc[homepage.orgName] = [];
    }
    acc[homepage.orgName].push(homepage);
    return acc;
  }, {} as Record<string, Homepage[]>);

  return (
    <Card className="bg-gray-50 dark:bg-[#040113] dark:border-[#0c0339] col-span-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Project Homepages</CardTitle>
        <Globe className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(groupedHomepages).map(([orgName, orgHomepages]) => (
            <div key={orgName} className="space-y-2 border rounded-lg p-4 dark:border-neutral-800">
              <h3 className="text-sm font-medium">{orgName}</h3>
              <div className="flex flex-wrap gap-2">
                {orgHomepages.map((homepage) => (
                  <Link
                    key={homepage.url}
                    href={homepage.url || '#'}
                    target="_blank"
                    className={`px-3 py-1 rounded-full text-xs flex items-center gap-1 ${
                      homepage.isGitHubPages
                        ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-300'
                        : 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-300'
                    }`}
                  >
                    {homepage.isFork && <GitFork className="h-3 w-3" />}
                    {homepage.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 