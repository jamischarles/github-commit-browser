import { useState } from "react";
import { useParams, useLoaderData } from "react-router-dom";

import {
  getCommitHistory,
  commitOptionType,
} from "../api/github";

// Displays a list of commits for the given repo 
export function RepoCommitList() {
  const { user = "", repo = "" } = useParams();
  const data = useLoaderData();
  const [commitList, updateCommitList] = useState<any>(data);
  const [allCommitsShown, setAllCommitsShown] = useState(false);

  async function loadMoreCommits(user: string, repo: string, sha?: string) {
    const options: commitOptionType = { sha };
    try {
      const olderCommits = await getCommitHistory(user, repo, options);
      updateCommitList(commitList.concat(olderCommits));
      if (olderCommits.length < 30) setAllCommitsShown(true);
    } catch (e) {
      setAllCommitsShown(true);
      // TODO: Add more generic error for non-404 responses.
    }
  }

  let lastCommitHash;

  const commitHistory = commitList.map((commitData: any, i: any) => {
    lastCommitHash = commitData.sha.substring(0, 7);
	const formattedDate = new Intl.DateTimeFormat('en-US', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(commitData.commit.author.date));
    return (
		<div key={i} className="commit-item" style={{marginBottom: 30 }}>
		  <h3 style={{fontSize: 20, marginBottom: 3}}>{commitData.commit.message.split("\n")[0]}

        <span>
          <strong>
            <a href={commitData.html_url}> {lastCommitHash}</a>
          </strong>
        </span>
	  </h3>{" "}
		  <span style={{fontSize: 14}}>
          by{" "}
          <a href={commitData.author.html_url}>
            {commitData.commit.author.name}
          </a>{" "}
          on <strong>{formattedDate.replace(',', ' at')} </strong>
        </span>
      </div>
    );
  });

  const loadMoreButton = allCommitsShown ? (
    <div>No more commits to show</div>
  ) : (
    <button
      className="load-more-button"
      onClick={loadMoreCommits.bind(null, user, repo, lastCommitHash)}
    >
      {" "}
      Load more{" "}
    </button>
  );

  return (
    <div>
      <h2>
        Repo commit view: {user}/{repo}
      </h2>
      <div className="commit-list"> {commitHistory}</div>
	<div data-testid='more-button-container'>{loadMoreButton}</div>
    </div>
  );
}
