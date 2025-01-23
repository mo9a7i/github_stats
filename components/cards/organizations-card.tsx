"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link";

interface OrganizationsCardProps {
  organizations: Array<{
    login: string;
    avatar_url: string;
    name: string;
  }>;
}

export function OrganizationsCard({ organizations }: OrganizationsCardProps) {
  const AVATAR_SIZE = "h-6 w-6";
  const AVATAR_GROUP_CLASS = "flex flex-wrap -space-x-1 mt-2 overflow-visible";
  const AVATAR_CLASS = `inline-block ${AVATAR_SIZE} rounded-full ring-1 ring-white hover:ring-neutral-200 transition-all bg-neutral-800`;

  return (
    <Card className="bg-gray-50 dark:bg-[#040113] dark:border-[#0c0339]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Organizations</CardTitle>
        <Users className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-5xl font-bold">{organizations.length}</div>
        <div className={AVATAR_GROUP_CLASS}>
          {organizations?.map((org) => org && (
            <Link
              key={org.login}
              href={`https://github.com/${org.login}`}
              target="_blank"
            >
              <Avatar
                title={org.name || org.login}
                className={AVATAR_CLASS}
                
              >
                <AvatarImage src={org.avatar_url} alt={org.login} />
                <AvatarFallback>{org?.login?.slice(0, 2)?.toUpperCase() || '??'}</AvatarFallback>
              </Avatar>
            </Link>
          )) || null}
        </div>
      </CardContent>
    </Card>
  );
} 