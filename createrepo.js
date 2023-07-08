const { Octokit } = require("@octokit/rest");
const axios = require('axios');
const fs = require('fs');
const octokit = new Octokit({
  auth: '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'
})
const sodium = require('libsodium-wrappers')
async function getPublicKey() {
  const owner = "ss0809";
  const repo = "my-new-repo";
  const token = "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";
  try {
    const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/actions/secrets/public-key`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const publicKey = response.data.key_id;
    console.log(publicKey);
    const secret = 'plain-text-secret';
    const key = publicKey;
    sodium.ready.then(async () => {
     try {
      let binkey = sodium.from_base64(key, sodium.base64_variants.ORIGINAL);
      let binsec = sodium.from_string(secret);
      let encBytes = sodium.crypto_box_seal(binsec, binkey);
      let output = sodium.to_base64(encBytes, sodium.base64_variants.ORIGINAL);
      console.log(output);
      await octokit.request('PUT /repos/{owner}/{repo}/actions/secrets/ACCESS_TOKEN', {
        owner: 'ss0809',
        repo: 'my-new-repo',
        secret_name: 'ACCESS_TOKEN',
        encrypted_value: output ,
        key_id: publicKey,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      });
        } catch (error) {
    console.error("Error 01:", error);
  }
    });
  } catch (error) {
    console.error("Error 02:", error);
  }
}

function replacer(filePath,searchWord,replacement){
// Read the file contents
fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }
  const modifiedData = data.replace(new RegExp(searchWord, 'g'), replacement);
  fs.writeFile(filePath, modifiedData, 'utf8', (err) => {
    if (err) {
      console.error('Error writing file:', err);
      return;
    }
    console.log('Word replaced successfully!');
  });
});
}
const createRepository = async () => {
  const repoName = 'my-new-repo';
  const token = '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';
  const filePaths = [
    'dtog.py',
    'gtod.py',
    'gtod.sh',
    'dtog.sh',
    'client_secrets.json',
    '.github/workflows/gtod.yml' ,
    '.github/workflows/dtog.yml'
  ];

  try {
    // Create the repository
    const response = await axios.post(
      'https://api.github.com/user/repos',
      { name: repoName, private: true },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.status === 201) {
      console.log('Repository created successfully!');

      // Get the repository's full name (including the owner)
      const fullName = response.data.full_name;

      for (const filePath of filePaths) {
        // Check if the current path is a folder
        const isFolder = filePath.endsWith('/');

        if (isFolder) {
          // Create the folder by adding a file with an empty content
          const folderResponse = await axios.put(
            `https://api.github.com/repos/${fullName}/contents/${filePath}`,
            {
              message: 'Add folder',
              content: Buffer.from('').toString('base64') // Empty content for folders
            },
            {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
          );

          if (folderResponse.status === 201) {
            console.log(`Folder '${filePath}' added successfully!`);
          } else {
            console.log(`Error adding folder '${filePath}':`, folderResponse.statusText);
          }
        } else {
          // Read the file content from the existing file
          const fileContent = fs.readFileSync(filePath, 'utf-8');

          // Add file to the repository
          const fileResponse = await axios.put(
            `https://api.github.com/repos/${fullName}/contents/${filePath}`,
            {
              message: 'Add file',
              content: Buffer.from(fileContent).toString('base64')
            },
            {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
          );

          if (fileResponse.status === 201) {
            console.log(`File '${filePath}' added successfully!`);
          } else {
            console.log(`Error adding file '${filePath}':`, fileResponse.statusText);
          }
        }
      }
    } else {
      console.log('Error creating repository:', response.statusText);
    }
  } catch (error) {
    console.log('Error:', error);
  }
};

getPublicKey();

