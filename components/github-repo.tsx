import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GitBranch, GitPullRequest, Eye, Star, AlertCircle, GitCommit, Clock } from "lucide-react";
import Link from "next/link";
import { GitHubRepo as GitHubRepoType } from "@/app/types/github";

interface GitHubRepoProps {
    repo: GitHubRepoType;
}

export function GitHubRepo({ repo }: GitHubRepoProps) {
    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <Card className="overflow-hidden text-gray-700 flex flex-col h-full">
            <CardHeader className="relative lg:py-2 lg:pb-0 px-4 lg:gap-2 lg:flex lg:flex-col">
                <CardTitle className="text-lg m-0 p-0 truncate">
                    <Link target="_blank" href={repo.html_url}>
                        {repo.name}
                        {repo.private && <span className="ml-2 text-xs bg-amber-200 text-amber-700 px-2 py-0.5 rounded">Private</span>}
                    </Link>
                </CardTitle>
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDate(repo.pushed_at)}
                    </span>
                    {repo.language && (
                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                            {repo.language}
                        </span>
                    )}
                    {repo.topics?.map(topic => (
                        <span key={topic} className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                            {topic}
                        </span>
                    ))}
                </div>
                <p className="text-sm text-gray-500 p-0 !mt-2 line-clamp-2">{repo.description || "No description available."}</p>
            </CardHeader>
            <CardContent className="p-4 pt-0 mt-auto">
                <div className="grid grid-cols-3 lg:grid-cols-6 gap-2 text-sm">
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
                                <Link key={contributor.id} target="_blank" href={contributor.html_url}>
                                <Avatar title={contributor.login} className="inline-block h-8 w-8 rounded-full shadow-sm shadow-black">
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
