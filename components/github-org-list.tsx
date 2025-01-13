"use client"

import { GitHubOrg as GitHubOrgType } from "@/app/types/github";
import { GitHubOrg } from "./github-org";
import { Accordion } from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, ChevronDown, ChevronUp, Globe, Code, GitFork } from "lucide-react";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { HomepagesCard } from "@/components/cards";

interface GitHubOrgListProps {
  orgsData: GitHubOrgType[];
  loading?: boolean;
  stats: {
    homepages: Array<{
      name: string;
      url: string;
      isGitHubPages: boolean;
      orgName: string;
      isFork: boolean;
    }>;
  };
}

export function GitHubOrgList({ orgsData, loading = false, stats }: GitHubOrgListProps) {
  const [sortBy, setSortBy] = useState("pushed");
  const [searchQuery, setSearchQuery] = useState("");
  const [homepageFilter, setHomepageFilter] = useState<'all' | 'source' | 'fork'>('all');
  const [expandedOrgs, setExpandedOrgs] = useState<string[]>([]);

  const toggleAllOrgs = () => {
    if (expandedOrgs.length) {
      setExpandedOrgs([]);
    } else {
      setExpandedOrgs(filteredAndSortedOrgs.map(org => org.login));
    }
  };

  const filterRepos = (org: GitHubOrgType) => {
    const query = searchQuery.toLowerCase();
    const isMatchingSearch = (text?: string | null) => text?.toLowerCase().includes(query) || false;
    
    return {
      ...org,
      repos: org.repos.filter(repo => {
        // Filter by search query
        const matchesSearch = 
          isMatchingSearch(repo.name) ||
          isMatchingSearch(repo.description) ||
          isMatchingSearch(repo.language) ||
          repo.topics?.some(topic => isMatchingSearch(topic)) ||
          isMatchingSearch(org.name) ||
          isMatchingSearch(org.login);
          
        // Filter by homepage type
        const matchesHomepageFilter = 
          homepageFilter === 'all' ||
          (homepageFilter === 'source' && !repo.fork) ||
          (homepageFilter === 'fork' && repo.fork);

        return matchesSearch && matchesHomepageFilter;
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


  return (
    <>

      <Card className="p-4 mb-6 bg-gray-50 dark:bg-[#040113] dark:border-[#0c0339]">
        <div className="flex flex-col items-center md:flex-row gap-4">
          <button
            onClick={toggleAllOrgs}
            className="p-2 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-[#0a032d] transition-colors flex items-center gap-2 text-sm text-muted-foreground"
            title={expandedOrgs.length ? "Collapse all" : "Expand all"}
          >
            {expandedOrgs.length ? (
              <>
                <ChevronUp className="h-4 w-4" />
                <span>Collapse all</span>
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                <span>Expand all</span>
              </>
            )}
          </button>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-2 w-full md:w-auto">
            <span className="text-sm text-muted-foreground whitespace-nowrap">Sort by:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-[140px] dark:bg-[#0a032d] dark:border-[#11044f]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="dark:bg-[#0a032d] dark:border-[#11044f]">
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="pushed">Last Pushed</SelectItem>
                <SelectItem value="stars">Stars</SelectItem>
                <SelectItem value="forks">Forks</SelectItem>
                <SelectItem value="commits">Commits</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setHomepageFilter('all')}
              className={`px-2 py-1 text-xs rounded-md flex items-center gap-1 ${
                homepageFilter === 'all' ? 'bg-neutral-200 dark:bg-neutral-800' : 'hover:bg-neutral-100 dark:hover:bg-neutral-900'
              }`}
            >
              <Globe className="h-3 w-3" />
              All Pages
            </button>
            <button
              onClick={() => setHomepageFilter('source')}
              className={`px-2 py-1 text-xs rounded-md flex items-center gap-1 ${
                homepageFilter === 'source' ? 'bg-neutral-200 dark:bg-neutral-800' : 'hover:bg-neutral-100 dark:hover:bg-neutral-900'
              }`}
            >
              <Code className="h-3 w-3" />
              Source Pages
            </button>
            <button
              onClick={() => setHomepageFilter('fork')}
              className={`px-2 py-1 text-xs rounded-md flex items-center gap-1 ${
                homepageFilter === 'fork' ? 'bg-neutral-200 dark:bg-neutral-800' : 'hover:bg-neutral-100 dark:hover:bg-neutral-900'
              }`}
            >
              <GitFork className="h-3 w-3" />
              Fork Pages
            </button>
          </div>

          <div className="relative flex-1 w-full md:max-w-md md:ml-auto">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground " />
            <Input
              placeholder="Search repositories, languages, topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9  dark:bg-[#0a032d] dark:border-[#11044f]"
            />
          </div>
          <div className="text-sm text-muted-foreground whitespace-nowrap text-center md:text-left">
            <span suppressHydrationWarning>
              {filteredAndSortedOrgs.reduce((sum, org) => sum + org.repos.length, 0)} repositories
            </span>
          </div>
        </div>
      </Card>

      <HomepagesCard 
        homepages={stats.homepages
          .filter(homepage => {
            // Apply search filter
            const matchesSearch = 
              homepage.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              homepage.orgName.toLowerCase().includes(searchQuery.toLowerCase());
              
            // Apply homepage type filter
            const matchesHomepageFilter = 
              homepageFilter === 'all' ||
              (homepageFilter === 'source' && !homepage.isFork) ||
              (homepageFilter === 'fork' && homepage.isFork);
              
            return matchesSearch && matchesHomepageFilter;
          })
          // Apply same sorting as repos
          .sort((a, b) => {
            switch (sortBy) {
              case "name":
                return a.name.localeCompare(b.name);
              // Add other sort cases if needed
              default:
                return 0;
            }
          })
        } 
      />

      <Accordion 
        type="multiple" 
        value={expandedOrgs}
        onValueChange={setExpandedOrgs}
      >
        {filteredAndSortedOrgs.map((org, index) => (
          <GitHubOrg key={`org-${index}-${org.login}`} org={org} />
        ))}
      </Accordion>
    </>
  );
}
