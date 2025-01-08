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
  contributors_url: string;
  commits_count: number | null;
  open_issues_count: number;
  subscribers_count: number;
  stargazers_count: number;
  open_issues: number;
  forks_count: number;
  contributors: GitHubContributor[];
  private: boolean;
  language: string | null;
  topics: string[];
  pushed_at: string;
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