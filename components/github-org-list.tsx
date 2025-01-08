"use client"

import { GitHubOrg as GitHubOrgType } from "@/app/types/github";
import { GitHubOrg } from "./github-org";
import { Accordion } from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

interface GitHubOrgListProps {
  orgsData: GitHubOrgType[];
  loading?: boolean;
}

export function GitHubOrgList({ orgsData, loading = false }: GitHubOrgListProps) {
  const [sortBy, setSortBy] = useState("pushed");
  const [searchQuery, setSearchQuery] = useState("");

  const filterRepos = (org: GitHubOrgType) => {
    const query = searchQuery.toLowerCase();
    return {
      ...org,
      repos: org.repos.filter(repo => {
        return (
          repo.name.toLowerCase().includes(query) ||
          repo.description?.toLowerCase().includes(query) ||
          repo.language?.toLowerCase().includes(query) ||
          repo.topics?.some(topic => topic.toLowerCase().includes(query)) ||
          org.name?.toLowerCase().includes(query) ||
          org.login.toLowerCase().includes(query)
        );
      })
    };
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4 border rounded-lg">
            <div className="flex items-center gap-4">
              <Skeleton className="h-16 w-16 rounded-lg" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Filter and sort organizations and their repos
  const filteredAndSortedOrgs = [...orgsData]
    .map(filterRepos)
    .filter(org => org.repos.length > 0) // Only show orgs with matching repos
    .map(org => ({
      ...org,
      repos: [...org.repos]
        // Sort repos
        .sort((a, b) => {
          switch (sortBy) {
            case "name":
              return a.name.localeCompare(b.name);
            case "stars":
              return b.stargazers_count - a.stargazers_count;
            case "forks":
              return b.forks_count - a.forks_count;
            case "pushed":
              return new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime();
            case "commits":
              return (b.commits_count || 0) - (a.commits_count || 0);
            default:
              return 0;
          }
        })
    }))
    // Sort organizations by filtered repo count
    .sort((a, b) => b.repos.length - a.repos.length);

  // Get the login of the first organization (most repos)
  const firstOrgId = filteredAndSortedOrgs[0]?.login;

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center mb-4">
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="pushed">Last Pushed</SelectItem>
            <SelectItem value="stars">Stars</SelectItem>
            <SelectItem value="forks">Forks</SelectItem>
            <SelectItem value="commits">Commits</SelectItem>
          </SelectContent>
        </Select>
        <div className="relative flex-1 max-w-md ml-auto">
          <Search className="absolute left-3 top-3 h-4 w-4 text-neutral-500" />
          <Input
            placeholder="Search repositories, languages, topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <Accordion type="multiple" defaultValue={[firstOrgId]}>
        {filteredAndSortedOrgs.map((org, index) => (
          <GitHubOrg key={`org-${index}-${org.login}`} org={org} />
        ))}
      </Accordion>
    </>
  );
}
