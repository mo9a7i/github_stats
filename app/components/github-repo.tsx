import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GitBranch, GitPullRequest, Eye, Star, AlertCircle, GitCommit } from "lucide-react";
import Link from "next/link";

interface GitHubRepoProps {
    repo: any; // Expect the entire repo object as a prop
}

export function GitHubRepo({ repo }: GitHubRepoProps) {
    return (
        <Card className="overflow-hidden text-gray-700">
            <CardHeader className="lg:py-2 lg:pb-0 px-4 lg:gap-2 lg:flex lg:flex-row lg:items-center">
                <CardTitle className="text-lg m-0 p-0">
                    <Link target="_blank" href={repo.html_url}>
                        {repo.name}
                    </Link>
                </CardTitle>
                <p className="text-sm text-gray-500 p-0 !mt-0">{repo.description || "No description available."}</p>
            </CardHeader>
            <CardContent className="p-4 pt-0 grid gap-2 lg:flex lg:justify-between">
                <div className="items-end flex lg:grid lg:grid-cols-8 gap-4 lg:gap-2 text-sm">
                    <div title="commits" className={`flex items-center text-sm ${!repo.commits_count ? "text-gray-200" : ""}`}>
                        <GitCommit className="mr-2 h-4 w-4" />
                        <span>{repo.commits_count || "Unknown commits"}</span>
                    </div>
                    <div title="pulls" className={`flex items-center lg:justify-end ${!repo.open_issues_count ? "text-gray-200" : ""}`}>
                        <GitPullRequest className="mr-1 h-3 w-3" />
                        <span>{repo.open_issues_count || 0}</span>
                    </div>
                    <div title="subscribers" className={`flex items-center lg:justify-end ${!repo.subscribers_count ? "text-gray-200" : ""}`}>
                        <Eye className="mr-1 h-3 w-3" />
                        <span>{repo.subscribers_count || 0}</span>
                    </div>
                    <div title="stars" className={`flex items-center lg:justify-end ${!repo.stargazers_count  ? "text-gray-200" : ""}`}>
                        <Star className="mr-1 h-3 w-3" />
                        <span>{repo.stargazers_count || 0}</span>
                    </div>
                    <div title="issues" className={`flex items-center lg:justify-end ${!repo.open_issues  ? "text-gray-200" : ""}`}>
                        <AlertCircle className="mr-1 h-3 w-3" />
                        <span>{repo.open_issues || 0}</span>
                    </div>
                    <div title="forks" className={`flex items-center lg:justify-end ${!repo.forks_count  ? "text-gray-200" : ""}`}>
                        <GitBranch className="mr-1 h-3 w-3" />
                        <span>{repo.forks_count || 0}</span>
                    </div>
                </div>
                <div className="">
                    <div className="flex -space-x-1 overflow-hidden">
                        {repo.contributors &&
                            repo.contributors.map((contributor: any) => (
                                <Link target="_blank" href={contributor.html_url}>
                                <Avatar key={contributor.id} title={contributor.login} className="inline-block h-8 w-8 rounded-full shadow-sm shadow-black">
                                    <AvatarImage src={contributor.avatar_url} alt={contributor.login} />
                                    <AvatarFallback>{contributor.login?.slice(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                </Link>
                            ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
