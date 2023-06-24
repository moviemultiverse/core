const { google } = require('googleapis');
const fs = require('fs');

const credentials = require('./drive-download-389811-b229f2e27ed8.json');
// Path to your service account credentials file
const SCOPES = ['https://www.googleapis.com/auth/drive'];

//
// Create a JWT client
const auth = new google.auth.JWT(
  credentials.client_email,
  null,
  credentials.private_key,
  SCOPES
);
auth.authorize((err, tokens) => {
  if (err) {
    console.error('Authentication failed:', err);
    return;
  }

  console.log('Authentication successful!');
  uploadFile(auth);
});

function uploadFile(auth) {
  const drive = google.drive({ version: 'v3', auth });

  const fileMetadata = {
    name: 'VID20230624183754.mp4', // Name of the file in Google Drive
  };

  const media = {
    mimeType: 'video/mp4',
    body: fs.createReadStream('VID20230624183754.mp4'), // Path to the local MP4 file
  };

  drive.files.create(
    {
      resource: fileMetadata,
      media: media,
      fields: 'id',
    },
    (err, res) => {
      if (err) {
        console.error('Upload failed:', err);
        return;
      }

      console.log('File uploaded successfully!');
      console.log('File ID:', res.data.id);
    }
  );
}
