const {google} = require('googleapis');
const fs = require('fs');



// Specify the ID of the file you want to add permissions to
const fileId = '1Jhd5m4cwefWZjTv_aSm7_H509Y8YBFhs';

// Define the permission to be created
const permission = {
  role: 'writer', // Can be 'owner', 'writer', 'commenter', or 'reader'
  type: 'user', // Can be 'user', 'group', 'domain', or 'anyone'
  emailAddress: 'saurabh45215@gmail.com', // Email address of the user or group
};

// Create a new JWT client using the service account credentials
const auth = new google.auth.GoogleAuth({
  credentials: '{"web":{"client_id":"1096318296267-a3l9r898cd6uc95n64at2q06k31duh45.apps.googleusercontent.com","project_id":"drive-download-389811","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_secret":"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","redirect_uris":["https://ss0809.github.io/driveapi/"],"javascript_origins":["https://ss0809.github.io"]}}',
  scopes: ['https://www.googleapis.com/auth/drive'],
});

// Authorize the client
const drive = google.drive({ version: 'v3', auth });

// Function to create the permission on the file
async function createPermission() {
  try {
    // Send the request to create the permission
    const response = await drive.permissions.create({
      fileId: fileId,
      requestBody: permission,
    });

    console.log('Permission created:', response.data);
  } catch (error) {
    console.error('Error creating permission:', error.message);
  }
}

// Call the function to create the permission
createPermission();

