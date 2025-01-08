import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GitFork, Star, GitBranch, Users, GitCommit, Clock } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link";

interface StatsCardsProps {
  stats: {
    totalRepos: number;
    publicRepos: number;
    privateRepos: number;
    totalStars: number;
    totalForks: number;
    totalContributors: number;
    totalCommits: number;
    lastUpdated: string;
    organizations: Array<{
      login: string;
      avatar_url: string;
      name: string;
    }>;
    contributors: Array<{
      login: string;
      avatar_url: string;
    }>;
  };
}

export function StatsCards({ stats }: StatsCardsProps) {
  const AVATAR_SIZE = "h-8 w-8";
  const AVATAR_GROUP_CLASS = "flex flex-wrap -space-x-2 mt-2 overflow-visible";
  const AVATAR_CLASS = `inline-block ${AVATAR_SIZE} rounded-full ring-2 ring-white hover:ring-neutral-200 transition-all bg-neutral-800`;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Repositories</CardTitle>
          <GitBranch className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalRepos}</div>
          <p className="text-xs text-muted-foreground">
            {stats.publicRepos} public, {stats.privateRepos} private
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Stars</CardTitle>
          <Star className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalStars}</div>
          <p className="text-xs text-muted-foreground">
            Across all repositories
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Organizations</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.organizations.length}</div>
          <div className={AVATAR_GROUP_CLASS}>
            {stats.organizations.map((org) => (
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
                  <AvatarFallback>{org.login.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Contributors</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalContributors}</div>
          <div className={AVATAR_GROUP_CLASS}>
            {stats.contributors.map((contributor) => (
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

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Commits</CardTitle>
          <GitCommit className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalCommits}</div>
          <p className="text-xs text-muted-foreground">
            Last updated {new Date(stats.lastUpdated).toLocaleDateString()}
          </p>
        </CardContent>
      </Card>
    </div>
  )
} 