import { GitHubOrg } from "./github-org";
import { Accordion } from "@/components/ui/accordion";

interface GitHubOrgListProps {
  orgsData: any[];
}

export function GitHubOrgList({ orgsData }: GitHubOrgListProps) {
  // Sort organizations by number of repos (most repos first)
  const sortedOrgs = [...orgsData].sort((a, b) => b.repos.length - a.repos.length);

  // Get the login of the first organization (most repos)
  const firstOrgId = sortedOrgs[0]?.login;

  return (
    <Accordion type="multiple" defaultValue={[firstOrgId]}>
      {sortedOrgs.map((org, index) => (
        <GitHubOrg key={`org-${index}-${org.login}`} org={org} />
      ))}
    </Accordion>
  );
}
