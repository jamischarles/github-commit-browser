// FIXME: Add a nice big comment here

// types for Github API endpoints
import { Endpoints, GetResponseTypeFromEndpointMethod } from "@octokit/types";
import { RestEndpointMethodTypes } from "@octokit/rest";

export type listRepoCommitsParameters =
  Endpoints["GET /repos/{owner}/{repo}/commits"]["parameters"];
export type listRepoCommitsResponse =
  RestEndpointMethodTypes["repos"]["listCommits"]["response"];


export interface commitOptionType {
  signal?: AbortSignal;
  sha?: string;
}

export async function getCommitHistory(
  userName: string,
  repoName: string,
  options: commitOptionType
): Promise<listRepoCommitsResponse["data"]> {
  const { sha, signal } = options;
  const url = `https://api.github.com/repos/${userName}/${repoName}/commits?${
    sha ? "sha=" + sha + "^" : ""
  }`;

  const response = await fetch(url, {
    headers: {
      Authorization:
        "token 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",
    },
    signal,
  });
  // const commitList: [listRepoCommitsResponse] = await response.json();
  const commitList = await response.json();

  // TODO: Improve this errors for "no more commits"
  if (response.status !== 200) {
    throw new RepoNotFoundError(response.statusText, {
      status: response.status,
    });
  }

  return commitList;
}

class RepoNotFoundError extends Error {
	status 
  constructor(message: string, props: any) {
    super(message); // (1)
    this.name = "RepoNotFound"; // (2)
    this.status = props.status;
  }
}
