const axios = require('axios');
const { Octokit } = require("@octokit/rest");
const githubToken = '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'; 
const octokit = new Octokit({
  auth: githubToken,
});
async function getWorkflowArtifacts(repository_name) {
  const repository_owner = "ss08090";
  const access_token = "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";
  var headers = {
    "Accept": "application/vnd.github+json",
    "Authorization": `Bearer ${access_token}`,
    "X-GitHub-Api-Version": "2022-11-28"
  };
  const url = `https://api.github.com/repos/${repository_owner}/${repository_name}/actions/runs`;

  try {
    const response = await axios.get(url, { headers });
    const data = response.data.workflow_runs;
    let artifactsInfo;
    for (const obj of data) {
      if (obj.name === 'upload to Google drive') {
        const artifactsUrl = `https://api.github.com/repos/${repository_owner}/${repository_name}/actions/runs/${obj.id}/artifacts`;
        const artifactsResponse = await axios.get(artifactsUrl, { headers });
        artifactsInfo = artifactsResponse.data.artifacts[0].id;
        break;
      }
      return artifactsResponse.data.artifacts[0];
    }
  } catch (error) {
    console.error(error);
    return error;
  }
}

module.exports = getWorkflowArtifacts;
//incomplete module