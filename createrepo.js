const { Octokit } = require('@octokit/rest');
const fs = require('fs');

const octokit = new Octokit({
  auth: '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' // Your personal access token
});

const createRepository = async () => {
  const repoName = 'my-new-repo';
  const filePath = 'file.txt'; // Path of the existing file

  try {
    // Create the repository
    const repoResponse = await octokit.repos.createForAuthenticatedUser({
      name: repoName,
      private: true
    });

    if (repoResponse.status === 201) {
      console.log('Repository created successfully!');

      // Get the repository's full name (including the owner)
      const fullName = repoResponse.data.full_name;

      // Read the file content from the existing file
      const fileContent = fs.readFileSync(filePath, 'utf-8');

      // Add file to the repository
      const fileResponse = await octokit.repos.createOrUpdateFileContents({
        owner: octokit.auth.username,
        repo: fullName,
        path: filePath,
        message: 'Add file',
        content: Buffer.from(fileContent).toString('base64')
      });

      if (fileResponse.status === 201) {
        console.log('File added successfully!');
      } else {
        console.log('Error adding file:', fileResponse.message);
      }
    } else {
      console.log('Error creating repository:', repoResponse.message);
    }
  } catch (error) {
    console.log('Error:', error.message);
  }
};

createRepository();
