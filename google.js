const { google } = require('googleapis');

// Load the service account credentials JSON file
const serviceAccountFile = 'credentials.json';
const serviceAccount = require(serviceAccountFile);

// Specify the ID of the file you want to add permissions to
const fileId = 'your-file-id';

// Define the permission to be created
const permission = {
  role: 'reader', // Can be 'owner', 'writer', 'commenter', or 'reader'
  type: 'user', // Can be 'user', 'group', 'domain', or 'anyone'
  emailAddress: 'example@gmail.com', // Email address of the user or group
};

// Create a new JWT client using the service account credentials
const auth = new google.auth.GoogleAuth({
  credentials: serviceAccount,
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

