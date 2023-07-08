const { Octokit } = require("@octokit/rest");
const axios = require('axios');
const fs = require('fs');
const sodium = require("libsodium-wrappers");

// Function to create a GitHub repository secret
async function createRepositorySecret(owner, repo, secretName, encryptedValue, keyId) {
  const octokit = new Octokit({
    auth: "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",
    userAgent: "MyApp v1.0.0",
    baseUrl: "https://api.github.com",
    previews: ["symmetra-preview"], // Required for using secrets API
    timeZone: "Europe/London",
    timeZoneOffset: 0,
  });

  const publicKeyResponse = await octokit.request(
    "GET /repos/{owner}/{repo}/actions/secrets/public-key",
    {
      owner,
      repo,
    }
  );

  const publicKey = publicKeyResponse.data.key;

  // Encrypt the secret value using libSodium
  const valueBytes = Buffer.from(encryptedValue);
  const keyBytes = Buffer.from(publicKey, "base64");
  const encryptedBytes = sodium.seal(valueBytes, keyBytes);
  const encryptedValueBase64 = Buffer.from(encryptedBytes).toString("base64");

  // Create or update the repository secret
  await octokit.request(
    "PUT /repos/ss0809/my-new-repo/actions/secrets/ACCESS_TOKEN",
    {
      owner,
      repo,
      secret_name: secretName,
      encrypted_value: encryptedValueBase64,
      key_id: keyId,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );

  console.log("Repository secret created successfully.");
}

// Usage example
createRepositorySecret("SS0809", "my-new-repo", "ACCESS_TOKEN", "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", "5682501672425497");
                               

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



