"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link";

interface ContributorsCardProps {
  totalContributors: number;
  contributors: Array<{
    login: string;
    avatar_url: string;
  }>;
}

export function ContributorsCard({ totalContributors, contributors }: ContributorsCardProps) {
  const AVATAR_SIZE = "h-6 w-6";
  const AVATAR_GROUP_CLASS = "flex flex-wrap -space-x-1 mt-2 overflow-visible";
  const AVATAR_CLASS = `inline-block ${AVATAR_SIZE} rounded-full ring-1 ring-white hover:ring-neutral-200 transition-all bg-neutral-800`;

  return (
    <Card className="bg-gray-50 dark:bg-[#040113] dark:border-[#0c0339]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Contributors</CardTitle>
        <Users className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-5xl font-bold">{totalContributors}</div>
        <div className={AVATAR_GROUP_CLASS}>
          {contributors.map((contributor) => (
            <Link
              key={contributor.login}
              href={`https://github.com/${contributor.login}`}
              target="_blank"
            >
              <Avatar
                title={contributor.login}
                className={AVATAR_CLASS}
              >
                <AvatarImage src={contributor.avatar_url} alt={contributor.login} />
                <AvatarFallback>{contributor.login.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 