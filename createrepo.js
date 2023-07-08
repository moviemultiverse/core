const axios = require('axios');

const createRepository = async () => {
  const repoName = 'my-new-repo';
  const token = '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';
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

  try {
    const response = await axios.post('https://api.github.com/user/repos', {
      name: repoName,
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 201) {
      console.log('Repository created successfully!');
      const repoUrl = response.data.html_url;

      for (const file of files) {
        await axios.put(`${repoUrl}/contents/${file.name}`, {
          message: `Add ${file.name}`,
          content: Buffer.from(file.content).toString('base64'),
        }, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        console.log(`File ${file.name} added successfully!`);
      }
    } else {
      console.log('Error creating repository:', response.statusText);
    }
  } catch (error) {
    console.log('Error:', error);
  }
};

createRepository();
