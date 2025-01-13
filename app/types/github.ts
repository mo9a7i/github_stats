export interface GitHubOrg {
  login: string;
  name: string;
  avatar_url: string;
  public_repos: number;
  total_private_repos: number;
  type: 'User' | 'Organization';
  repos: GitHubRepo[];
}

export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  private: boolean;
  fork: boolean;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  open_issues: number;
  subscribers_count: number;
  language: string | null;
  topics: string[];
  pushed_at: string;
  contributors_url: string;
  contributors: Array<{
    id: number;
    login: string;
    avatar_url: string;
    html_url: string;
  }>;
  has_pages: boolean;
  homepage: string | null;
  owner: any;
  commits_count: number | null;
  languages_url: string;
  languages_stats?: Record<string, number>;  // bytes of code per language
}

export interface GitHubContributor {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
}

export interface GitHubApiUser {
  login: string;
  name: string;
  avatar_url: string;
  public_repos: number;
  type: 'User';
}

export interface LanguageStats {
  name: string;
  count: number;
  lines: number;
  percentage: number;
  color?: string;  // GitHub language colors
}

export interface LanguageLinesStats {
  name: string;
  bytes: number;
  lines?: number;
  percentage: number;
  color?: string;
}

