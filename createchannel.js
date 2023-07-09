/*const { v4: uuidv4 } = require('uuid');
const { google } = require('googleapis');
const { JWT } = require('google-auth-library');

// Load the service account private key JSON file
const privatekey = require('./drive-download-389811-b229f2e27ed8.json');

// Generate a UUID for the channel
const channelId = uuidv4();

// Authenticate using the service account
const jwtClient = new JWT({
  email: privatekey.client_email,
  key: privatekey.private_key,
  scopes: ['https://www.googleapis.com/auth/drive'],
});

async function createDriveNotificationChannel() {
  const drive = google.drive({ version: 'v3', auth: jwtClient });

  // Define the notification channel parameters
  const resourceId = '1i9n5sFg2KNT-hSj4X-C3vJwOEanFJsn3';
  const notificationUrl = 'https://discord.com/api/webhooks/1127586462888632442/rZ0jAcTLZPjTATiVcgqySR8nD81SBdqTS-Dvam9TA51NTcJdRlk9-7ZOjFajPt_C_zFY';

  // Create the channel
  const response = await drive.changes.watch({
    pageToken: null, // No need for pagetoken here
    requestBody: {
      id: channelId,
      type: 'web_hook',
      address: notificationUrl,
    },
    resource: {
      fileId: resourceId,
    },
  });

  console.log('Notification channel created:', response.data);
}

createDriveNotificationChannel().catch(console.error);
  */
/**
 * Retrieve the list of changes for the currently authenticated user.
 * @param {string} savedStartPageToken page token got after executing fetch_start_page_token.js file
 **/
async function fetchChanges(savedStartPageToken) {
  // Get credentials and build service
  // TODO (developer) - Use appropriate auth mechanism for your app

  const {GoogleAuth} = require('google-auth-library');
  const {google} = require('googleapis');

  const auth = new GoogleAuth({
    scopes: 'https://www.googleapis.com/auth/drive.readonly',
  });
  const service = google.drive({version: 'v3', auth});
  try {
    let pageToken = savedStartPageToken;
    do {
      const res = await service.changes.list({
        pageToken: savedStartPageToken,
        fields: '*',
      });
      res.data.changes.forEach((change) => {
        console.log('change found for file: ', change.fileId);
      });
      pageToken = res.data.newStartPageToken;
      return pageToken;
    } while (pageToken);
  } catch (err) {
    // TODO(developer) - Handle error
    throw err;
  }
}
