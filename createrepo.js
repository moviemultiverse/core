const { Octokit } = require("@octokit/rest");
const axios = require('axios');
const fs = require('fs');
const sodium = require('sodium').api;

const octokit = new Octokit({
  auth: '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'
})

async function createRepoSecret() {
  const owner = 'SS0809';
  const repo = 'my-new-repo';
  const secretName = 'ACCESS_TOKEN';
  const valueToEncrypt = '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';
  const keyId = '568250167242549743'; // Replace with your key ID

  // Generate a random encryption key
  const key = sodium.crypto_secretbox_keygen();

  // Encrypt the secret value
  const nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);
  const encryptedValue = sodium.crypto_secretbox_easy(
    Buffer.from(valueToEncrypt),
    nonce,
    key
  );

  // Convert the encrypted value and nonce to hexadecimal strings
  const encryptedValueHex = encryptedValue.toString('hex');
  const nonceHex = nonce.toString('hex');

  const octokit = new Octokit({
    auth: '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',
    baseUrl: 'https://api.github.com',
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    }
  });

  try {
    // Create the repository secret
    const response = await octokit.actions.createOrUpdateRepoSecret({
      owner,
      repo,
      secret_name: secretName,
      encrypted_value: encryptedValueHex,
      key_id: keyId,
      key: key.toString('hex'),
      nonce: nonceHex
    });

    console.log('Repository secret created:', response.data);
  } catch (error) {
    console.error('Error creating repository secret:', error);
  }
}

// Call the function
createRepoSecret();




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



