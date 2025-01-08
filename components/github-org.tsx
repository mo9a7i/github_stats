import Image from "next/image";
import { GitHubRepo } from "./github-repo";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { GitHubOrg as GitHubOrgType } from "@/app/types/github";

interface GitHubOrgProps {
    org: GitHubOrgType;
    defaultExpanded?: boolean;
}

// Helper function to format the repository string
const formatRepoCount = (publicCount: number, privateCount: number, type: string) => {
    const publicStr = publicCount > 0 ? `${publicCount} public ${publicCount > 1 ? "repos" : "repo"}` : "";
    const privateStr = privateCount > 0 ? `${privateCount} private ${privateCount > 1 ? "repos" : "repo"}` : "";
    const typeIndicator = type === "User" ? "👤 " : "🏢 ";

    if (publicStr && privateStr) {
        return `${typeIndicator}${publicStr} - ${privateStr}`;
    }
    return `${typeIndicator}${publicStr || privateStr || "No repos"}`;
};

export function GitHubOrg({ org }: GitHubOrgProps) {
    const repos = Array.isArray(org.repos) ? org.repos : [];

    const repoCountStr = formatRepoCount(org.public_repos || 0, org.total_private_repos || 0, org.type || "Organization");

    return (
        <AccordionItem className="dark:border-[#11044f]" value={org.login}>
            <AccordionTrigger>
                <div className="w-full text-xl flex-col md:flex-row md:justify-between font-medium items-start md:items-center md:gap-2">
                    <div className="flex items-center gap-2">
                        <Image src={org.avatar_url} alt={org.login} width={64} height={64} className="rounded-lg shadow-md bg-neutral-800" />
                        <div className="w-full items-start md:items-center flex flex-col md:flex-row md:justify-between">
                            <span className="flex  items-start flex-col md:flex-row min-w-0 gap-0.5 md:gap-2">
                                <span className="truncate">{org.name || "No Name"}</span>
                                <small className="text-gray-500 truncate">@{org.login}</small>
                            </span>
                            <small className="text-sm text-gray-500 me-2">{repoCountStr}</small>
                        </div>
                    </div>
                </div>
            </AccordionTrigger>
            <AccordionContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {repos.map((repo: any) => (
                    <GitHubRepo key={repo.id} repo={repo} />
                ))}
            </AccordionContent>
        </AccordionItem>
    );
}
