const { Octokit } = require("@octokit/rest");
const axios = require('axios');
const fs = require('fs');
const repoName = 'my-new-repo';
  const token = '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';
const fullname;

function replacer(filePath, wordPairs) {
  // Read the file contents
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return;
    }
    let modifiedData = data;
    wordPairs.forEach(([searchWord, replacement]) => {
      modifiedData = modifiedData.replace(new RegExp(searchWord, 'g'), replacement);
    });

    fs.writeFile(filePath, modifiedData, 'utf8', (err) => {
      if (err) {
        console.error('Error writing file:', err);
        return;
      }
      console.log('Words replaced successfully!');
    });
  });
}

const createRepository = async () => {
    const wordPairs = [
  ['randomfileid', '12blkfBMK9mBNRRBwmN8Cqh0FBD3UELxl'],
  ['randomfilepath', '/home/runner/work/your_name/your_name/'],
  // Add more word pairs as needed
];
  replacer('dtog.py',wordPairs);
 const wordPairs2 = [
  ['randomfile.mp4', 'strangerthingss01e02.mp4'],
  // Add more word pairs as needed
];
replacer('gtod.py',wordPairs2);
const wordPairs3 = [
  ['randomfile.mp4', 'strangerthingss01e02.mp4'],
  // Add more word pairs as needed
];
replacer('gtod.sh',wordPairs3);
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
       fullname = response.data.full_name;

      for (const filePath of filePaths) {
        // Check if the current path is a folder
        const isFolder = filePath.endsWith('/');

        if (isFolder) {
          // Create the folder by adding a file with an empty content
          const folderResponse = await axios.put(
            `https://api.github.com/repos/${fullname}/contents/${filePath}`,
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
            `https://api.github.com/repos/${fullname}/contents/${filePath}`,
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

const updateFile = async ( filePath, token) => {
  try {
    // Read the file content from the existing file
    const fileContent = fs.readFileSync(filePath, 'utf-8');

    // Get the current file information
    const response = await axios.get(
      `https://api.github.com/repos/${fullname}/contents/${filePath}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.status === 200) {
      const { sha } = response.data;

      // Update the file by sending a PUT request with the new content
      const fileResponse = await axios.put(
        `https://api.github.com/repos/${fullname}/contents/${filePath}`,
        {
          message: 'Update file',
          content: Buffer.from(fileContent).toString('base64'),
          sha: sha
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (fileResponse.status === 200) {
        console.log(`File '${filePath}' updated successfully!`);
      } else {
        console.log(`Error updating file '${filePath}':`, fileResponse.statusText);
      }
    } else {
      console.log(`File '${filePath}' not found in the repository.`);
    }
  } catch (error) {
    console.log('Error:', error);
  }
};

// Usage example
const filePath = 'path/to/file.txt'; // Replace with the path of the file you want to update

updateFile( filePath, token);



createRepository();

