import { GitHubOrgList } from '../components/github-org-list';
import { getCache, setCache } from '@/lib/cache';
import { Suspense } from 'react';
import { StatsCards } from '@/components/stats-cards';
import { GitHubRepo, LanguageLinesStats } from './types/github';
import { Metadata } from 'next';
import defaultMetadata from './metadata';
import { ThemeToggle } from '@/components/theme-toggle';

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  HTML: "#e34c26",
  Vue: "#41b883",
  Astro: "#f0f0f0",
  PHP: "#4F5D95",
  Java: "#b07219",
  "C#": "#178600",
  Other: "#6e7681"
};

// Add configuration type
interface GitHubConfig {
  baseUrl: string;
  headers: {
    Authorization: string;
    Accept: string;
    'X-GitHub-Api-Version': string;
  };
}

interface GitHubApiOrg {
  login: string;
  name: string;
  avatar_url: string;
  public_repos: number;
  total_private_repos: number;
}

interface GitHubApiUser {
  login: string;
  name: string;
  avatar_url: string;
  public_repos: number;
  total_private_repos: number;
  type: 'User';
}

export const metadata: Metadata = {
  ...defaultMetadata,
  alternates: {
    canonical: 'https://mo9a7i.github.io/github_stats'
  }
};

export default async function Home() {
  // Initialize GitHub configuration
  const config: GitHubConfig = {
    baseUrl: process.env.GITHUB_API_URL || 'https://api.github.com',
    headers: {
      Authorization: `Bearer ${process.env.GH_TOKEN}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': process.env.GITHUB_API_VERSION || '2022-11-28',
    }
  };

  // Parse organization filters
  const includedOrgs = process.env.INCLUDED_ORGS?.split(',').map(org => org.trim());
  const excludedOrgs = process.env.EXCLUDED_ORGS?.split(',').map(org => org.trim());

  const fetchOrganizations = async () => {
    try {
      // Fetch both user orgs and user info in parallel
      const [orgsResponse, userResponse] = await Promise.all([
        fetch(`${config.baseUrl}/user/orgs`, { headers: config.headers }),
        fetch(`${config.baseUrl}/user?include_private=true`, { headers: config.headers })
      ]);

      // Debug user response headers
      console.log('DEBUG: User Response Headers:', {
        status: userResponse.status,
        headers: Object.fromEntries(userResponse.headers.entries())
      });

      const [organizations, userData] = await Promise.all([
        orgsResponse.json() as Promise<GitHubApiOrg[]>,
        userResponse.json() as Promise<GitHubApiUser>
      ]);

      // Debug only user data
      console.log('DEBUG: User API Data:', {
        ...userData,
      });

      // Debug full user data
      console.log('DEBUG: Raw User API Response:', JSON.stringify(userData, null, 2));
      console.log('DEBUG: User Scopes:', userResponse.headers.get('x-oauth-scopes'));

      // Get private repos count for user
      const userReposResponse = await fetch(
        `${config.baseUrl}/user/repos?per_page=1&visibility=private&affiliation=owner`,
        { headers: config.headers }
      );
      // Get Link header to count total private repos
      const linkHeader = userReposResponse.headers.get('link');
      let privateReposCount = 0;
      
      if (linkHeader) {
        const match = linkHeader.match(/page=(\d+)>; rel="last"/);
        if (match) {
          privateReposCount = parseInt(match[1], 10);
        }
      } else {
        // If no Link header, count from the response
        const repos = await userReposResponse.json();
        privateReposCount = Array.isArray(repos) ? repos.length : 0;
      }

      console.log('DEBUG: User data:', {
        login: userData.login,
        type: userData.type,
        public_repos: userData.public_repos,
        private_repos: privateReposCount,
        total_repos: userData.public_repos + privateReposCount
      });

      // Create a pseudo-org object from user data
      const userOrg = {
        login: userData.login,
        name: userData.name || userData.login,
        avatar_url: userData.avatar_url,
        public_repos: userData.public_repos,
        total_private_repos: privateReposCount,
        type: 'User'
      };
      
      // Combine user as pseudo-org with real orgs
      const allOrgs = [userOrg, ...organizations];
      
      // Filter organizations based on environment variables
      const filteredOrgs = Array.isArray(allOrgs) 
        ? allOrgs
            .map((org) => org.login)
            .filter(org => {
              if (includedOrgs?.length) return org === userData.login || includedOrgs.includes(org);
              if (excludedOrgs?.length) return !excludedOrgs.includes(org);
              return true;
            })
        : [];
      return filteredOrgs;
    } catch (error) {
      console.error("Error fetching organizations:", error);
      return [];
    }
  };

  // Add rate limiting tracking

 

  const fetchOrgData = async (org: string) => {
    try {
      // Check cache first
      const cacheKey = `org-${org}`;
      const cachedData = getCache(cacheKey);
      if (cachedData) {
        console.log(`Using cached data for ${org}`);
        return cachedData;
      }

      // Determine if we're fetching user repos or org repos
      const userResponse = await fetch(`${config.baseUrl}/users/${org}`, { headers: config.headers });
      const userData = await userResponse.json();
      const isUser = userData.type === 'User';

      
      
      // For users, we need to fetch all repos (including private ones if token has access)
      const reposUrl = isUser 
        ? userData.login === org 
            ? `${config.baseUrl}/user/repos?per_page=100&affiliation=owner&sort=updated`  // For authenticated user
            : `${config.baseUrl}/users/${org}/repos?per_page=100&type=owner&sort=updated`  // For other users
        : `${config.baseUrl}/orgs/${org}/repos?per_page=100&type=all`;

      const [orgResponse, reposResponse] = await Promise.all([
        isUser 
          ? Promise.resolve({ json: () => Promise.resolve(userData) })
          : fetch(`${config.baseUrl}/orgs/${org}`, { headers: config.headers }),
        fetch(reposUrl, { headers: config.headers })
      ]);

      const [orgData, reposData] = await Promise.all([
        orgResponse.json(),
        reposResponse.json()
      ]);

      // Add error handling for reposData
      if (!Array.isArray(reposData)) {
        console.error(`Invalid repos data for ${org}:`, reposData);
        return { ...orgData, repos: [] };
      }

      console.log(`Fetched ${reposData.length} repositories for ${isUser ? 'user' : 'org'} ${org}`);

      // Enhance each repository with additional details
      const enhancedRepos = await Promise.all(
        reposData.map(async (repo: any) => {
          try {
            // Check cache for repo details
            const repoCacheKey = `repo-${repo.id}`;
            const cachedRepoData = getCache(repoCacheKey);
            if (cachedRepoData) {
              return cachedRepoData;
            }

            const [contributorsResponse, commitsResponse, languagesResponse] = await Promise.all([
              fetch(repo.contributors_url, { headers: config.headers }),
              fetch(`${repo.url}/commits?per_page=1`, { headers: config.headers }),
              fetch(repo.languages_url, { headers: config.headers })
            ]);

            const [contributorsData, languagesData] = await Promise.all([
              contributorsResponse.json(),
              languagesResponse.json()
            ]);

            const commitsLinkHeader = commitsResponse.headers.get("Link");
            let commitsCount = null;

            if (commitsLinkHeader) {
              const match = commitsLinkHeader.match(/page=(\d+)>; rel="last"/);
              if (match) {
                commitsCount = parseInt(match[1], 10);
              }
            }

            const repoData = {
              ...repo,
              contributors: Array.isArray(contributorsData) ? contributorsData.slice(0, 5) : [],
              commits_count: commitsCount,
              languages_stats: languagesData
            };

            // Cache individual repo data
            setCache(repoCacheKey, repoData);
            return repoData;
          } catch (error: any) {
            console.error(`Error fetching details for repo ${repo.name}:`, error.message);
            return { ...repo, contributors: [], commits_count: null };
          }
        })
      );

      const result = { ...orgData, repos: enhancedRepos };
      
      // Cache the complete org data
      setCache(cacheKey, result);
      return result;
    } catch (error) {
      console.error(`Error fetching data for ${org}:`, error);
      return { name: org, repos: [] };
    }
  };

  const warmCache = async (orgs: string[]) => {
    console.log('Warming cache...');
    await Promise.all(orgs.map(async (org) => {
      const cacheKey = `org-${org}`;
      if (!getCache(cacheKey)) {
        await fetchOrgData(org);
      }
    }));
    console.log('Cache warming complete');
  };

  // Fetch the list of organizations
  const organizations = await fetchOrganizations();
  
  // Warm up the cache
  await warmCache(organizations);

  const orgsData = await Promise.all(organizations.map(fetchOrgData));
  const sortedOrgsData = orgsData.sort((a, b) => {
    const totalReposA = (a.public_repos || 0) + (a.total_private_repos || 0);
    const totalReposB = (b.public_repos || 0) + (b.total_private_repos || 0);
    return totalReposB - totalReposA;
  });

    // Calculate total public and private repos
    const totalPublicRepos = orgsData.reduce((sum, org) => sum + (org.public_repos || 0), 0);
    const totalPrivateRepos = orgsData.reduce((sum, org) => sum + (org.total_private_repos || 0), 0);
    const totalRepos = totalPublicRepos + totalPrivateRepos;
  
    // Calculate total lines stats
    const languageBytesStats = orgsData.reduce((stats: Record<string, number>, org) => {
      org.repos.forEach((repo: GitHubRepo) => {
        if (repo.languages_stats) {
          Object.entries(repo.languages_stats).forEach(([lang, bytes]) => {
            stats[lang] = (stats[lang] || 0) + bytes;
          });
        }
      });
      return stats;
    }, {});

    const totalBytes = Object.values(languageBytesStats).reduce((sum, bytes) => sum + bytes, 0);
    const BYTES_PER_LINE = 120; // Average line length estimation
    const LINES_PER_HOUR = 50 / 8; // 50 lines per day (8 hours)
    const totalLines = Math.round(totalBytes / BYTES_PER_LINE);
    const totalHours = Math.round(totalLines / LINES_PER_HOUR);

    function createLanguageStats(
      name: string,
      bytes: number,
      percentage: number,
      color?: string
    ): LanguageLinesStats {
      return {
        name,
        bytes,
        lines: Math.round(bytes / BYTES_PER_LINE),
        percentage,
        color
      };
    }

    // Get top 5 languages by bytes and combine rest into "Others"
    const topLanguagesByBytes = Object.entries(languageBytesStats)
      .sort(([, a], [, b]) => b - a)
      .reduce<LanguageLinesStats[]>((acc, [name, bytes], index) => {
        if (index < 5) {
          acc.push(createLanguageStats(name, bytes, (bytes / totalBytes) * 100, LANGUAGE_COLORS[name] || LANGUAGE_COLORS.Other));
        } else if (index === 5) {
          const otherBytes = Object.entries(languageBytesStats).slice(5).reduce((sum, [, bytes]) => sum + bytes, 0);
          acc.push(createLanguageStats('Others', otherBytes, (otherBytes / totalBytes) * 100, LANGUAGE_COLORS.Other));
        }
        return acc;
      }, []);

    // Calculate total stats
    const totalStats = {
      totalRepos,
      publicRepos: totalPublicRepos,
      privateRepos: totalPrivateRepos,
      totalStars: orgsData.reduce((sum, org) => 
        sum + org.repos.reduce((repoSum: number, repo: GitHubRepo) => repoSum + repo.stargazers_count, 0), 0
      ),
      totalForks: orgsData.reduce((sum, org) => 
        sum + org.repos.reduce((repoSum: number, repo: GitHubRepo) => repoSum + repo.forks_count, 0), 0
      ),
      totalIssues: orgsData.reduce((sum, org) => 
        sum + org.repos.reduce((repoSum: number, repo: GitHubRepo) => repoSum + repo.open_issues || 0, 0), 0
      ),
      organizations: orgsData.map(org => ({
        login: org.login,
        avatar_url: org.avatar_url,
        name: org.name || org.login
      })),
      contributors: Array.from(new Set(
        orgsData.flatMap(org => 
          org.repos.flatMap((repo: GitHubRepo) => repo.contributors)
        ).map(c => JSON.stringify({ login: c.login, avatar_url: c.avatar_url }))
      )).map(str => JSON.parse(str)),
      totalContributors: new Set(
        orgsData.flatMap((org: any) => 
          org.repos.flatMap((repo: GitHubRepo) => repo.contributors.map(c => c.login))
        )
      ).size,
      totalCommits: orgsData.reduce((sum, org) => 
        sum + org.repos.reduce((repoSum: number, repo: GitHubRepo) => repoSum + (repo.commits_count || 0), 0), 0
      ),
      lastUpdated: new Date().toISOString(),
      languages: Object.entries(
        orgsData.reduce((langs: Record<string, number>, org) => {
          org.repos.forEach((repo: GitHubRepo) => {
            if (repo.language) {
              langs[repo.language] = (langs[repo.language] || 0) + 1;
            }
          });
          return langs;
        }, {})
      )
      .map(([name, count]) => ({
        name,
        count,
        lines: Math.round(count / BYTES_PER_LINE),
        percentage: (count / totalRepos) * 100
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5),
      languageBytes: {
        languages: topLanguagesByBytes,
        totalBytes
      },
      developmentStats: {
        totalLines,
        totalHours
      },
      homepages: orgsData.flatMap(org => 
        org.repos
          .filter((repo: GitHubRepo) => repo.has_pages || repo.homepage)
          .map((repo: GitHubRepo) => ({
            name: repo.name,
            url: repo.has_pages 
              ? `https://${repo.owner.login}.github.io/${repo.name}/`
              : repo.homepage,
            isGitHubPages: repo.has_pages,
            orgName: org.name || org.login,
            isFork: repo.fork
          }))
      ),
    };

  return (
    <main className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">
          {process.env.NEXT_PUBLIC_APP_NAME}
          <small className="block font-thin text-base text-gray-700 dark:text-gray-300">
            {process.env.NEXT_PUBLIC_APP_DESCRIPTION}
          </small>
        </h1>
        <ThemeToggle />
      </div>
      <StatsCards stats={totalStats} />
      <Suspense fallback={<GitHubOrgList orgsData={[]} loading={true} stats={{ homepages: [] }} />}>
        <GitHubOrgList orgsData={sortedOrgsData} stats={totalStats} />
      </Suspense>
    </main>
  );
}
