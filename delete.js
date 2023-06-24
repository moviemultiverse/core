const { google } = require('googleapis');
const fs = require('fs');

// Function to delete an MP4 file in Google Drive
async function deleteMP4File(fileId) {
  try {
    // Authenticate using the service account credentials
   

const SCOPES = ['https://www.googleapis.com/auth/drive'];

// Load the service account credentials
const credentials = require('./drive-download-389811-b229f2e27ed8.json');

// Create a JWT client
const authh = new google.auth.JWT(
  credentials.client_email,
  null,
  credentials.private_key,
  SCOPES
);
authh.authorize((err, tokens) => {
  if (err) {
    console.error('Authentication failed:', err);
    return;
  }

  console.log('Authentication successful!');
  
});
const drive = google.drive({ version: 'v3', auth: authh });

    // Delete the file
    await drive.files.delete({
      fileId: fileId,
    });

    console.log('File deleted successfully.');
  } catch (error) {
    console.error('Error deleting file:', error);
  }
}

// Usage example
const fileIdToDelete = 'your-file-id'; // Replace with the actual file ID of the MP4 file to delete
deleteMP4File('1eFGrBCxDUwmcpncIK4aNigohhLckqg4F');
deleteMP4File('1V-tFql0cvi1zBMiQ2S6TJQv0YtStIyVM');
deleteMP4File('1OwuFOSAFd8g3EwZka_omW0k72yurlmwK');
deleteMP4File('1wGAKKoJzIUwJmDjD05vJYh0jLXH8v5WB');
