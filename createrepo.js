const axios = require('axios');
const fs = require('fs');
const { Octokit } = require('@octokit/core');

const octokit = new Octokit({
  auth: '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'
});

const createRepository = async () => {
  const repoName = 'my-new-repo';
  const token = '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';
  const filePath = 'file.txt'; // Path of the existing file

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
        console.log('File added successfully!');
        createRepositoryPermission(fullName);
      } else {
        console.log('Error adding file:', fileResponse.statusText);
      }
    } else {
      console.log('Error creating repository:', response.statusText);
    }
  } catch (error) {
    console.log('Error:', error);
  }
};

const createRepositoryPermission = async (repoFullName) => {
  try {
    const response = await octokit.request('PUT /repos/{owner}/{repo}/actions/permissions', {
      owner: repoFullName.split('/')[0], // Extract the owner from the full name
      repo: repoFullName.split('/')[1], // Extract the repository name from the full name
      enabled: true,
      allowed_actions: 'selected',
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });

    if (response.status === 204) {
      console.log('Workflow permissions set successfully!');
    } else {
      console.log('Error setting workflow permissions:', response.status);
    }
  } catch (error) {
    console.log('Error:', error.message);
  }
}

createRepository();
