
const { google } = require('googleapis');
const { JWT } = require('google-auth-library');

// Load the service account private key JSON file
const privatekey ='./drive-download-389811-b229f2e27ed8.json'; ;

// Authenticate using the service account
const jwtClient = new JWT({
  email: privatekey.client_email,
  key: privatekey.private_key,
  scopes: ['https://www.googleapis.com/auth/drive'],
});
async function createDriveNotificationChannel() {
  const drive = google.drive({ version: 'v3', auth: jwtClient });

  // Define the notification channel parameters
  const channelId = '15e9fc84-5049-495e-bbb9-3605e980f0be';
  const resourceId = '13cPqUdKzJM4vuYX-GD0YvhtZgvZNa1aF';
  const notificationUrl = 'https://script.google.com/macros/u/7/s/AKfycbwGt1l54qrsrwo2Zv4VUa9qCk4PwZmFKK5FrktEeRQIIpDhyE6bjubCNhYVzqJyKHnt/exec';

  // Create the channel
  const response = await drive.channels.insert({
    requestBody: {
      id: channelId,
      type: 'web_hook',
      address: notificationUrl,
    },
    params: { resourceId },
  });

  console.log('Notification channel created:', response.data);
}
createDriveNotificationChannel().catch(console.error);
    
