/* const {google} = require('googleapis');
const fs = require('fs');

const GOOGLE_APPLICATION_CREDENTIALS="/drive-download-389811-1563f008c882.json";


// Specify the ID of the file you want to add permissions to
const fileId = '1Jhd5m4cwefWZjTv_aSm7_H509Y8YBFhs';

// Define the permission to be created
const permission = {
  role: 'writer', // Can be 'owner', 'writer', 'commenter', or 'reader'
  type: 'user', // Can be 'user', 'group', 'domain', or 'anyone'
  emailAddress: 'saurabh45215@gmail.com', // Email address of the user or group
};

// Create a new JWT client using the service account credentials
const auth = new google.auth.GoogleAuth({credentials: GOOGLE_APPLICATION_CREDENTIALS,
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
const { google } = require('googleapis');
const credentials = require('./drive-download-389811-b229f2e27ed8.json');
const scopes = [
  'https://www.googleapis.com/auth/drive'
];
const auth = new google.auth.JWT(
  credentials.client_email, null,
  credentials.private_key, scopes
);
const drive = google.drive({ version: "v3", auth });
drive.files.list({}, (err, res) => {
  if (err) throw err;
  const files = res.data.files;
  if (files.length) {
  files.map((file) => {
    console.log(file);
  });
  } else {
    console.log('No files found');

  }
});
*

//drive-download@drive-download-389811.iam.gserviceaccount.com
const { google } = require('googleapis');
const credentials = require('./drive-download-389811-b229f2e27ed8.json');
const scopes = [
  'https://www.googleapis.com/auth/drive'
];
const auth = new google.auth.JWT(
  credentials.client_email, null,
  credentials.private_key, scopes
);
const d = new Date(Date.now() + (5 * 60 * 1000)).toISOString();
const drive = google.drive({ version: "v3", auth });
drive.files.permissions.update({
    "fileId": "1wW7M1fqTe6WvTHM9xo8q1Rxk3aw9GW1B",
    "permissionId": "15077873222703838624",
    "resource": {
        "expirationTime" : d,
  "role":"reader"
    }
}, (err, res) => {
  console.log(res);
});*/
const { google } = require('googleapis');
const fs = require('fs');
async function createFilePermission(authClient, fileId, emailAddress, role) {
  try {
    const drive = google.drive({ version: 'v3', auth: authClient });

    const permission = {
      role: role,
      type: 'user',
      emailAddress: emailAddress
    };

    const response = await drive.permissions.create({
      fileId: fileId,
      requestBody: permission,
      fields: 'id'
    });
     console.log(`Permission created with ID: ${response.data.id}`);
     await setTimeout(await deleteFilePermission(fileId, ${response.data.id}),300000);
  } catch (error) {
    console.error('Error creating permission:', error);
  }
}
async function deleteFilePermission(fileId, permissionId) {
  try {
    // Load the service account credentials from JSON key file
    const credentials = require('./drive-download-389811-b229f2e27ed8.json');


    // Configure the Google API client with the service account credentials
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/drive'],
    });

    // Create a Google Drive client
    const drive = google.drive({ version: 'v3', auth });

    // Delete the file permission
    await drive.permissions.delete({
      fileId,
      permissionId,
    });

    console.log(`Permission ${permissionId} deleted successfully.`);
  } catch (error) {
    console.error('Error deleting permission:', error);
  }
}
        
  
async function main() {
  try {
    // Load the service account credentials
    const credentials = require('./drive-download-389811-b229f2e27ed8.json');

    // Create an auth client using the service account credentials
    const authClient = new google.auth.GoogleAuth({
      credentials: credentials,
      scopes: ['https://www.googleapis.com/auth/drive']
    });

    // Authorize the client
    const auth = await authClient.getClient();

    // Specify the file ID, email address, and role for the permission
    const fileId = '1wW7M1fqTe6WvTHM9xo8q1Rxk3aw9GW1B';
    const emailAddress = '0111cs211163.saurabh5@gmail.com';
    const role = 'writer';

    // Create the file permission
    await createFilePermission(auth, fileId, emailAddress, role);
      } catch (error) {
    console.error('Error:', error);
  }
}

main();
  
