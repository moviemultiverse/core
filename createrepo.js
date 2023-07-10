const { Octokit } = require("@octokit/rest");
const axios = require('axios');
const fs = require('fs');
const { google } = require('googleapis');

const suppliedfileid = '1ktHC2pFCGCRQw4OKp5hOthgTzuC7oBBX';
const token = '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';
const suppliedfilename = '';

// Load the service account credentials
const credentials = require('./drive-download-389811-b229f2e27ed8.json');

// Create a new instance of the Google Drive API
const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/drive'],
});
const drive = google.drive({ version: 'v3', auth });

// Specify the file ID
const fileId = suppliedfileid;

// Define a function to get the file metadata
const getFileMetadata = async () => {
  try {
    const res = await drive.files.get({
      fileId: fileId,
      fields: 'name',
    });
    return res.data.name;
  } catch (error) {
    console.error('Error retrieving file:', error);
    throw error;
  }
};

// Specify the file paths
const filePaths = [
  'dtog.py',
  'gtod.py',
  'gtod.sh',
  'dtog.sh',
  'client_secrets.json',
  '.github/workflows/gtod.yml',
  '.github/workflows/dtog.yml'
];

// Define a function to replace words in a file
const replacer = async (filePath, wordPairs) => {
  try {
    // Read the file contents
    const data = await fs.promises.readFile(filePath, 'utf8');
    let modifiedData = data;
    wordPairs.forEach(([searchWord, replacement]) => {
      modifiedData = modifiedData.replace(new RegExp(searchWord, 'g'), replacement);
    });
    await fs.promises.writeFile(filePath, modifiedData, 'utf8');
    console.log('Words replaced successfully!');
  } catch (error) {
    console.error('Error reading/writing file:', error);
    throw error;
  }
};

const createRepository = async () => {
  try {
    // Get the file name from Google Drive
    const suppliedfilename = await getFileMetadata();
    console.log('File name:', suppliedfilename);

    var repoName = suppliedfilename;
repoName = repoName.replace(/\.mp4$/, "");
console.log(repoName); 

    // Define the word pairs for replacements
    const wordPairs = [
      ['randomfileid', suppliedfileid],
      ['randomfilepath', '/home/runner/work/' + repoName + '/' + repoName + '/']
    ];
    const wordPairs2 = [
      ['randomfile.mp4', suppliedfilename]
    ];
    const wordPairs3 = [
      ['randomfile.mp4', suppliedfilename]
    ];

    // Replace words in files
    await replacer('dtog.py', wordPairs);
    await replacer('gtod.py', wordPairs2);
    await replacer('gtod.sh', wordPairs3);

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
          // Create the folder by adding a file with empty content
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
          const fileContent = await fs.promises.readFile(filePath, 'utf-8');

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
  if (error.response) {
    console.log('Error:', error.response.data);
  } else {
    console.log('Error:', error.message);
  }
}

};

createRepository();
