import Image from "next/image";
import { GitHubRepo } from "./github-repo";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface GitHubOrgProps {
    org: any;
    defaultExpanded?: boolean;
}

// Helper function to format the repository string
const formatRepoCount = (publicCount: number, privateCount: number) => {
    const publicStr = publicCount > 0 ? `${publicCount} public ${publicCount > 1 ? "repos" : "repo"}` : "";
    const privateStr = privateCount > 0 ? `${privateCount} private ${privateCount > 1 ? "repos" : "repo"}` : "";

    if (publicStr && privateStr) {
        return `${publicStr} - ${privateStr}`;
    }
    return publicStr || privateStr || "No repos";
};

export function GitHubOrg({ org }: GitHubOrgProps) {
    const repos = Array.isArray(org.repos) ? org.repos : [];
    const repoCountStr = formatRepoCount(org.public_repos || 0, org.total_private_repos || 0);

    return (
        <AccordionItem value={org.login}>
            <AccordionTrigger>
                <div className="text-start pe-6 w-full text-xl flex justify-between font-medium items-center">
                    <div className="flex items-center gap-2">
                    <Image src={org.avatar_url} alt={org.login} width={64} height={64} className="rounded-lg shadow-md" />
                    <span>
                        {org.name || "No Name"} {/* Fallback to login if name is not available */}
                        <small className="text-gray-500">@{org.login}</small>
                    </span>
                    </div>
                    <small className="text-sm text-gray-500">{repoCountStr}</small>
                </div>
            </AccordionTrigger>
            <AccordionContent className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-2">
                {repos.map((repo: any) => (
                    <GitHubRepo key={repo.id} repo={repo} />
                ))}
            </AccordionContent>
        </AccordionItem>
    );
}
