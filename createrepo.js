const { Octokit } = require("@octokit/rest");
const axios = require('axios');
const fs = require('fs');
const { google } = require('googleapis');
const { Pool } = require('pg');
const pool = new Pool({
  host: 'satao.db.elephantsql.com',
  port: 5432,
  database: 'iywyfbqc',
  user: 'iywyfbqc',
  password: 'qAGx55jepOzWXVmB2IZxn-F-rulL3zRR'
});
   
// file A.js
const createRepository = async (suppliedfileid) => {
//const suppliedfileid = '1s0jdnGdtdg2aYWIMkwx8v2-EP7GBN678';
const token = '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';
var suppliedfilename = '';

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
var size_mb ;
// Define a function to get the file metadata
const getFileMetadata = async () => {
  try {
    const res = await drive.files.get({
      fileId: fileId,
      fields: 'name , size ',
    });
    size_mb = res.data.size.toString().substring(0, 4) ;
    console.log(size_mb);
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
  'run.py',
  'snapshot.py',
  'services.py',
  'doodstream.py',
  'streamtape.py',
  'output.py',
  'command.sh',
  'client_secrets.json',
  '.github/workflows/gtod.yml',
  '.github/workflows/cron.yml',
  '.github/workflows/dtog.yml'
];
    // Get the file name from Google Drive
    suppliedfilename = await getFileMetadata();
    console.log('File name:', suppliedfilename);

    var repoName = suppliedfilename;
repoName = repoName.replace(/\.mp4$/, "");
console.log(repoName); 

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
             pool.query(
  'INSERT INTO moviedata (drive_code  , movie_name , size_mb , streamtape_code , doodstream_code  , is_github ) \
  VALUES ($1, $2, $3, $4, $5, $6);',
  [fileId, repoName, size_mb, null, null, 1],
  (error, results) => {
    if (error) {
      console.error('Error executing query', error);
    } else {
      console.log("added to database");
    }
  }
);

      // Get the repository's full name (including the owner)
      const fullName = response.data.full_name;

      for (var filePath of filePaths) {
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
          var fileContent = await fs.promises.readFile('repoassets/' +filePath, 'utf-8');
          // Add file to the repository
          if (
  filePath === 'doodstream.py' ||
  filePath === 'streamtape.py' ||
  filePath === 'snapshot.py' ||
  filePath === 'gtod.sh' ||
  filePath === 'gtod.py'
) {
         fileContent = fileContent.replace(/randomfile.mp4/g, suppliedfilename);
           console.log('Words replaced successfully!');
       } else if (
  filePath === 'dtog.py' 
) { 
         fileContent = fileContent.replace(/randomfileid/g, suppliedfileid);
         fileContent = fileContent.replace(/randomfilepath/g, '/home/runner/work/' + repoName + '/' + repoName + '/');
           console.log('Words replaced successfully!');
       } else if (
  filePath === 'services.py' 
        ) {
    fileContent = fileContent.replace(/randomfile.mp4/g, suppliedfilename);
    fileContent = fileContent.replace(/randomfile.mp4/g, suppliedfilename);
    fileContent = fileContent.replace(/randomfileid/g, 'https://drive.google.com/file/d/'+ suppliedfileid+'/view');
           console.log('Words replaced successfully!');
       }
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
console.log(suppliedfileid);
console.log(suppliedfilename);

 return "created repo";
};
module.exports = createRepository;
