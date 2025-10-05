/**
 * GitHub API client for fetching repository and user data
 * Uses GitHub REST API v3
 */

export interface GitHubRepo {
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  topics: string[];
  created_at: string;
  updated_at: string;
  pushed_at: string;
  size: number;
  fork: boolean;
  archived: boolean;
  disabled: boolean;
  open_issues_count: number;
  homepage: string | null;
}

export interface GitHubUser {
  login: string;
  name: string | null;
  bio: string | null;
  company: string | null;
  location: string | null;
  email: string | null;
  blog: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

export interface RepoLanguages {
  [language: string]: number;
}

export interface CommitActivity {
  total: number;
  week: number;
  days: number[];
}

/**
 * Extract GitHub username from various GitHub URL formats
 */
export function extractGitHubUsername(url: string): string | null {
  const patterns = [
    /github\.com\/([^\/\?]+)/,
    /^([a-zA-Z0-9-]+)$/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * Fetch user's public repositories
 */
export async function fetchUserRepos(
  username: string,
  includeForked: boolean = false
): Promise<GitHubRepo[]> {
  const response = await fetch(
    `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`,
    {
      headers: {
        Accept: "application/vnd.github.v3+json",
        ...(process.env.GITHUB_TOKEN && {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        }),
      },
    }
  );

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
  }

  let repos: GitHubRepo[] = await response.json();

  // Filter out forks if requested
  if (!includeForked) {
    repos = repos.filter((repo) => !repo.fork);
  }

  // Filter out archived and disabled repos
  repos = repos.filter((repo) => !repo.archived && !repo.disabled);

  return repos;
}

/**
 * Fetch user profile information
 */
export async function fetchUserProfile(username: string): Promise<GitHubUser> {
  const response = await fetch(`https://api.github.com/users/${username}`, {
    headers: {
      Accept: "application/vnd.github.v3+json",
      ...(process.env.GITHUB_TOKEN && {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      }),
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch languages used in a repository
 */
export async function fetchRepoLanguages(
  owner: string,
  repo: string
): Promise<RepoLanguages> {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/languages`,
    {
      headers: {
        Accept: "application/vnd.github.v3+json",
        ...(process.env.GITHUB_TOKEN && {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        }),
      },
    }
  );

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch README content for a repository
 */
export async function fetchRepoReadme(
  owner: string,
  repo: string
): Promise<string | null> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/readme`,
      {
        headers: {
          Accept: "application/vnd.github.v3.raw",
          ...(process.env.GITHUB_TOKEN && {
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          }),
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    return response.text();
  } catch (error) {
    console.error(`Error fetching README for ${owner}/${repo}:`, error);
    return null;
  }
}

/**
 * Fetch commit activity for a repository (last 52 weeks)
 */
export async function fetchRepoCommitActivity(
  owner: string,
  repo: string
): Promise<CommitActivity[]> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/stats/commit_activity`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          ...(process.env.GITHUB_TOKEN && {
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          }),
        },
      }
    );

    if (!response.ok) {
      return [];
    }

    return response.json();
  } catch (error) {
    console.error(`Error fetching commit activity for ${owner}/${repo}:`, error);
    return [];
  }
}

/**
 * Get aggregated language statistics across all repos
 */
export function aggregateLanguages(repos: GitHubRepo[]): { [lang: string]: number } {
  const languageCounts: { [lang: string]: number } = {};

  repos.forEach((repo) => {
    if (repo.language) {
      languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
    }
  });

  return languageCounts;
}

/**
 * Calculate activity score based on recent commits
 */
export function calculateActivityScore(
  commitActivity: CommitActivity[]
): { score: number; level: string } {
  const recentWeeks = commitActivity.slice(-12); // Last 3 months
  const totalCommits = recentWeeks.reduce((sum, week) => sum + week.total, 0);

  let level = "inactive";
  if (totalCommits > 100) level = "very active";
  else if (totalCommits > 50) level = "active";
  else if (totalCommits > 20) level = "moderate";
  else if (totalCommits > 5) level = "light";

  return { score: totalCommits, level };
}

/**
 * Fetch comprehensive GitHub data for a user
 */
export async function fetchGitHubPortfolio(githubUrl: string) {
  const username = extractGitHubUsername(githubUrl);
  if (!username) {
    throw new Error("Invalid GitHub URL or username");
  }

  const [profile, repos] = await Promise.all([
    fetchUserProfile(username),
    fetchUserRepos(username, false),
  ]);

  const languageStats = aggregateLanguages(repos);

  return {
    username,
    profile,
    repos,
    languageStats,
    totalRepos: repos.length,
    totalStars: repos.reduce((sum, repo) => sum + repo.stargazers_count, 0),
  };
}
