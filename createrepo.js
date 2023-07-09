const { Octokit } = require("@octokit/rest");
const axios = require('axios');
const fs = require('fs');
const suppliedfileid ='1BbpV69mP-EZLRhSXpTyppsSl8MR7Vuf-';
const token = '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';
  const suppliedfilename ='';
const { google } = require('googleapis');

// Load the service account credentials
const credentials = require('./drive-download-389811-b229f2e27ed8.json');

// Create a new instance of the Google Drive API
const drive = google.drive({
  version: 'v3',
  auth: new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/drive'],
  }),
});

// Specify the file ID
const fileId = suppliedfileid;

// Call the Drive API to get the file metadata
drive.files.get(
  {
    fileId: fileId,
    fields: 'name',
  },
  (err, res) => {
    if (err) {
      console.error('Error retrieving file:', err);
      return;
    }
     suppliedfilename = res.data.name;
    console.log('File name:', suppliedfilename);
  }
);

const repoName = suppliedfilename;
const wordPairs = [
  ['randomfileid', suppliedfileid],
  ['randomfilepath', '/home/runner/work/'+suppliedfilename+'/'+suppliedfilename+'/']
];
const wordPairs2 = [
  ['randomfile.mp4', suppliedfilename+'.mp4']
];
const wordPairs3 = [
  ['randomfile.mp4', suppliedfilename+'.mp4']
];
const filePaths = [
    'dtog.py',
    'gtod.py',
    'gtod.sh',
    'dtog.sh',
    'client_secrets.json',
    '.github/workflows/gtod.yml' ,
    '.github/workflows/dtog.yml'
  ];
  
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
  
  
  replacer('dtog.py',wordPairs);
 
replacer('gtod.py',wordPairs2);

replacer('gtod.sh',wordPairs3);
  

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


createRepository();
