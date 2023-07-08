const axios = require('axios');

// Replace <TOKEN> with your personal access token
const token = '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';
const repoName = 'myrepo';
const files = [
  {
    name: 'file1.txt',
    content: 'File 1 content',
  },
  {
    name: 'file2.txt',
    content: 'File 2 content',
  },
];

async function createRepo() {
  try {
    // Create a new repository
    const repoResponse = await axios.post('https://api.github.com/user/repos', {
      name: repoName,
      private: false,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Get the newly created repository's URL
    const repoUrl = repoResponse.data.html_url;

    // Add files to the repository
    for (const file of files) {
      await axios.put(`${repoUrl}/contents/${file.name}`, {
        message: `Add ${file.name}`,
        content: Buffer.from(file.content).toString('base64'),
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    console.log('Repository and files created successfully!');
  } catch (error) {
    console.error('An error occurred:', error.response.data.message);
  }
}

createRepo();
