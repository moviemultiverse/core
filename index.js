const axios = require('axios');
const { google } = require('googleapis');
const fs = require('fs');
const { Octokit } = require("@octokit/rest");

// Create an Octokit instance with your PAT
const octokit = new Octokit({
  auth: "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",
});

// Define the repository and workflow details

const express = require('express');
var app = express();
app.use(express.json());
const credentials = require('./drive-download-389811-b229f2e27ed8.json');

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
     return response.data.id;
  } catch (error) {
    console.error('Error creating permission:', error);
  }
}
async function deleteFilePermission(fileId, permissionId) {
  try {
    // Load the service account credentials from JSON key file
    

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
        
  async function main(user_id,file_id)
  {

    try {
    // Load thei  // Create an auth client using the service account credentials
    const authClient = new google.auth.GoogleAuth({
      credentials: credentials,
      scopes: ['https://www.googleapis.com/auth/drive']
    });

    // Authorize the client
    const auth = await authClient.getClient();

    // Specify the file ID, email address, and role for the permission
    const fileId = file_id;
    const emailAddress = user_id;
    const role = 'writer';

    // Create the file permission
    await createFilePermission(auth, fileId, emailAddress, role)
  .then(response => {
    // Wait for 5 minutes (300,000 milliseconds) and then call the second function with the response from the first function
    setTimeout(() =>  deleteFilePermission(fileId, response), 300000);
  })
  .catch(error => {
    console.error('Error occurred:', error);
  });


      } catch (error) {
    console.error('Error:', error);
    }
  }
async function getfiles() {
  try {
    const auth = new google.auth.JWT(
      credentials.client_email,
      null,
      credentials.private_key,
      ['https://www.googleapis.com/auth/drive']
    );

    const drive = google.drive({ version: 'v3', auth });
    const response = await drive.files.list({});
    const files = response.data.files;

    if (files.length) {
      console.log(files);
      return files;
    } else {
      console.log('No files found');
      return [];
    }
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}




  

/*
async function fetchResponses(file) {
  const responses = [];
  const urls = [
    'https://api.streamsb.com/api/upload/url?key=46443yy1674fu5ych9iq0&url=',
    'https://doodapi.com/api/upload/url?key=49943w31dwl3crvaz1tui&url=',
    'https://upstream.to/api/upload/url?key=55196gnvzsjuwpss4ea1y&url=',
    'https://api.streamtape.com/remotedl/add?login=f65b540c475b9b7d4da8&key=268XaKDBLqTZ2kg&url='
  ];

  for (const url of urls) {
    const fullUrl = url.concat(file);

    try {
      const response = await axios.get(fullUrl);
      if (response.status === 200) {
        const data = response.data;
        responses.push(data);
      }
    } catch (error) {
      console.error('Error occurred during fetch:', error);
    }
  }

  return responses;
}
*/

async function triggerWorkflowDispatch( workflowId) {
  const owner = "ss0809";//use workflow runid for rerun
const repo = "strangerthingss01e02";
await octokit.request('POST /repos/{owner}/{repo}/actions/runs/{run_id}/rerun', {
  owner: owner,
  repo: repo,
  run_id: workflowId
})
}

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



app.listen(3000);
app.get('/', (req, res) => {
  //res.sendFile('index.html');
});
app.get('/deletefile', async function(req, res) {
  const file_id = req.query.file_id;
  const files = await deleteMP4File(file_id);
  res.json(files);
});
/*
app.get('/sharefile', async function(req, res) {
  const file_id = req.query.file_id;
  const files = await fetchResponses(file_id);
  res.json(files);
});*/
app.get('/workflow', async function(req, res) {
  const workflowid = req.query.workflowid;
  const files = await triggerWorkflowDispatch(workflowid);
  res.json(files);
});


app.get('/getfiles', async (req, res) => {
  try {
    const files = await getfiles();
    res.json(files);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const createRepository = require('./createrepo.js'); 
app.get('/createrepo', function(req, res) {
  var file_id = req.query.fileid;
res.json(createRepository(file_id));
});
app.get('/api', function(req, res) {
  const user_id = req.query.id; 
  const file_id = req.query.fileid;
main(user_id,file_id);
  


 /* res.send({
    'user_id': user_id,
    'file_id': file_id
  });*/
  res.redirect('https://ss0809.github.io/Googleservice/?fileid='+file_id);
});
async function sendDiscordWebhook(webhookURL, message) {
  try {
    const response = await axios.post(webhookURL, {
      content: message
    });
    console.log('Message sent to Discord webhook');
  } catch (error) {
    console.error('Error sending message to Discord webhook:', error);
  }
}


app.post("/", async (req, res) => {
 console.log("posted");
 console.log(req.headers);
  });
app.post("/post", async (req, res) => {
  var headers = req.headers;
  headersJSON = JSON.stringify(headers, null, 2);
  console.log("posted");
   sendDiscordWebhook('https://discord.com/api/webhooks/1127586462888632442/rZ0jAcTLZPjTATiVcgqySR8nD81SBdqTS-Dvam9TA51NTcJdRlk9-7ZOjFajPt_C_zFY', headersJSON);
  console.log(headers);
});
