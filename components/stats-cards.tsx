import { LanguagesCard, RepositoriesCard, StarsCard, OrganizationsCard, ContributorsCard, CommitsCard, IssuesCard, LanguageBytesCard, DevelopmentTimeCard, CoffeeCupsCard } from "./cards";

interface StatsCardsProps {
    stats: {
        totalRepos: number;
        publicRepos: number;
        privateRepos: number;
        totalStars: number;
        totalForks: number;
        totalIssues: number;
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
        languages: Array<{
            name: string;
            count: number;
            percentage: number;
        }>;
        languageBytes: {
            languages: Array<{
                name: string;
                bytes: number;
                percentage: number;
                color?: string;
            }>;
            totalBytes: number;
        };
        developmentStats: {
            totalLines: number;
            totalHours: number;
        };
        homepages: Array<{
            name: string;
            url: string;
            isGitHubPages: boolean;
            orgName: string;
            isFork: boolean;
        }>;
    };
}

export function StatsCards({ stats }: StatsCardsProps) {
    return (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4  mb-6">
            <OrganizationsCard organizations={stats.organizations} />

            <ContributorsCard totalContributors={stats.totalContributors} contributors={stats.contributors} />

            <DevelopmentTimeCard totalLines={stats.developmentStats.totalLines} />

            <CoffeeCupsCard totalHours={stats.developmentStats.totalHours} />

            <RepositoriesCard totalRepos={stats.totalRepos} publicRepos={stats.publicRepos} privateRepos={stats.privateRepos} />

            <StarsCard totalStars={stats.totalStars} />

            <CommitsCard totalCommits={stats.totalCommits} lastUpdated={stats.lastUpdated} />

            <IssuesCard totalIssues={stats.totalIssues} />

            <LanguagesCard languages={stats.languages} />

            <LanguageBytesCard languages={stats.languageBytes.languages} totalBytes={stats.languageBytes.totalBytes} />
        </div>
    );
}
