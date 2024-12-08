import { GitHubOrgList } from './components/github-org-list';

export default async function Home() {
  const headers = { Authorization: `Bearer ${process.env.GH_TOKEN}` };

  // Fetch user's organizations dynamically
  const fetchOrganizations = async () => {
    try {
      const response = await fetch(`https://api.github.com/user/orgs`, { headers });
      const organizations = await response.json();
      return Array.isArray(organizations) ? organizations.map((org) => org.login) : [];
    } catch (error) {
      console.error("Error fetching user organizations:", error);
      return [];
    }
  };

  // Fetch the list of organizations
  const organizations = await fetchOrganizations();

  const fetchOrgData = async (org: string) => {
    try {
      const orgResponse = await fetch(`https://api.github.com/orgs/${org}`, { headers });
      const orgData = await orgResponse.json();
  
      const reposResponse = await fetch(`https://api.github.com/orgs/${org}/repos?per_page=100`, { headers });
      const reposData = await reposResponse.json();
  
      // Enhance each repository with additional details
      const enhancedRepos = await Promise.all(
        reposData.map(async (repo: any) => {
          try {
            const contributorsResponse = await fetch(repo.contributors_url, { headers });
            const contributorsData = await contributorsResponse.json();
  
            const commitsResponse = await fetch(`${repo.url}/commits?per_page=1`, { headers });
            const commitsLinkHeader = commitsResponse.headers.get("Link");
            let commitsCount = null;
            if (commitsLinkHeader) {
              const match = commitsLinkHeader.match(/page=(\d+)>; rel="last"/);
              if (match) {
                commitsCount = parseInt(match[1], 10);
              }
            }
  
            return {
              ...repo,
              contributors: Array.isArray(contributorsData) ? contributorsData.slice(0, 5) : [],
              commits_count: commitsCount,
            };
          } catch (error:any) {
            console.error(`Error fetching details for repo ${repo.name}:`, error.message);
            return { ...repo, contributors: [], commits_count: null };
          }
        })
      );
  
      return { ...orgData, repos: enhancedRepos };
    } catch (error) {
      console.error(`Error fetching data for ${org}:`, error);
      return { name: org, repos: [] };
    }
  };

  const orgsData = await Promise.all(organizations.map(fetchOrgData));
  const sortedOrgsData = orgsData.sort((a, b) => (b.public_repos + b.total_private_repos) - (a.public_repos + a.total_private_repos));

    // Calculate total public and private repos
    const totalPublicRepos = orgsData.reduce((sum, org) => sum + (org.public_repos || 0), 0);
    const totalPrivateRepos = orgsData.reduce((sum, org) => sum + (org.total_private_repos || 0), 0);
    const totalRepos = totalPublicRepos + totalPrivateRepos;
  

  return (
    <main className="container mx-auto p-4 ">
    <h1 className="text-4xl font-bold mb-8">
      Orgs and Repos
      <small className="block font-thin text-base text-gray-700">
        6 Degrees Github Stats is a simple web app to show the stats of 6 Degrees Github organization and their repositories.
      </small>
    </h1>
    <h2 className="text-2xl font-medium mb-4 text-end">
      Total Repositories: {totalRepos} ({totalPublicRepos} public, {totalPrivateRepos} private)
    </h2>
    <GitHubOrgList orgsData={sortedOrgsData} />
  </main>
  );
}
