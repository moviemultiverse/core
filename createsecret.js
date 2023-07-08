const { Octokit } = require('@octokit/rest');

async function getRepoPublicKey() {
  const octokit = new Octokit({
    auth: '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'
  });

  try {
    const response = await octokit.request('GET /repos/SS0809/my-new-repo/actions/secrets/public-key', {
      owner: 'SS0809',
      repo: 'my_new_repo',
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });

    const { key_id, key } = response.data;
    console.log('Key ID:', key_id);
    console.log('Public Key:', key);
  } catch (error) {
    console.error('Error retrieving repo public key:', error);
  }
}

getRepoPublicKey();
