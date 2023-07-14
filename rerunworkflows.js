const axios = require('axios');

const repository_owner = "ss08090";
const repository_name = "Fast_iX"; // changeable with randomfilename
const access_token = "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";
const headers = {
  "Accept": "application/vnd.github+json",
  "Authorization": `Bearer ${access_token}`,
  "X-GitHub-Api-Version": "2022-11-28"
};
const url = `https://api.github.com/repos/${repository_owner}/${repository_name}/actions/runs`;

axios.get(url, { headers })
  .then(response => {
    const data = response.data.workflow_runs;
    let run_id = null;
    for (const obj of data) {
      if (obj.name === 'upload to Google drive') {
        run_id = obj.id;
        break;
      }
    }

    if (run_id) {
      const rerunUrl = `https://api.github.com/repos/${repository_owner}/${repository_name}/actions/runs/${run_id}/rerun`;
      axios.post(rerunUrl, {}, {
        headers: {
          "Authorization": `Bearer ${access_token}`,
          "Accept": "application/vnd.github.v3+json",
          "X-GitHub-Api-Version": "2022-11-28"
        }
      })
      .then(response => console.log(response.data))
      .catch(error => console.error(error));
    }
  })
  .catch(error => console.error(error));
