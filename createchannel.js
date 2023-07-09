const { google } = require('googleapis');

// Load the service account credentials from the downloaded JSON file
const credentials = require('client_secrets.json');

// Set up the Google Drive API client
const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/drive']
});
const drive = google.drive({ version: 'v3', auth });

// Set up the notification channel
const folderId ='13cPqUdKzJM4vuYX-GD0YvhtZgvZNa1aF'; // Replace with the actual folder ID
const channel = {
  type: 'web_hook',
  address: 'https://script.google.com/macros/u/7/s/AKfycbwGt1l54qrsrwo2Zv4VUa9qCk4PwZmFKK5FrktEeRQIIpDhyE6bjubCNhYVzqJyKHnt/exec', // Replace with your webhook URL
  id: '15e9fc84-5049-495e-bbb9-3605e980f0be'
};

// Create the notification channel
drive.channels.create(
  {
    requestBody: {
      id: channel.id,
      type: channel.type,
      address: channel.address
    },
    resourceId: folderId
  },
  (err, res) => {
    if (err) {
      console.error('Error creating notification channel:', err);
      return;
    }
    console.log('Notification channel created:', res.data);
  }
);

