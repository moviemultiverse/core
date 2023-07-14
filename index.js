const { Pool } = require('pg');
const pool = new Pool({
  host: 'satao.db.elephantsql.com',
  port: 5432,
  database: 'iywyfbqc',
  user: 'iywyfbqc',
  password: 'qAGx55jepOzWXVmB2IZxn-F-rulL3zRR'
});
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
     // console.log(files);
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





async function updateJsonData(jsonValue) {
  try {
    const client = await pool.connect();
    const query = `
      UPDATE jsondata
      SET var = $1
      WHERE id = 1; 
    `;
    const values = [jsonValue];
    await client.query(query, values);
    client.release();
    console.log('jsondata updated successfully');
  } catch (error) {
    console.error('Error updating jsondata:', error);
  }
}
async function getJsonData() {
  try {
    const client = await pool.connect();
    const query = 'SELECT * FROM jsondata';
    const result = await client.query(query);
    client.release();
    const jsonData = result.rows;
    return jsonData;//array of object
   // console.log('JSON data:', JSON.stringify(jsonData));
  } catch (error) {
    console.error('Error retrieving JSON data:', error);
  }
}

const jsondetect = require('./jsondetect.js'); 
app.post("/post", async (req, res) => {
//google step
  var headers = req.headers;
  headersJSON = JSON.stringify(headers, null, 2);
  console.log("posted");
//  console.log(headersJSON);
var xGoogResourceState = headers['x-goog-resource-state'];
  //check if it is for update 
if (xGoogResourceState == 'update') {
  console.log('update');

//google step


//  console.log(headers);

//var originalJSON = [{"kind":"drive#file","mimeType":"video/mp4","id":"1LPDxs46onuIkU2rqSYQFPOJddVoYMKpl","name":"Fast_iX.mp4"},{"kind":"drive#file","mimeType":"application/vnd.google-apps.folder","id":"13cPqUdKzJM4vuYX-GD0YvhtZgvZNa1aF","name":"Services"},{"kind":"drive#file","mimeType":"image/jpeg","id":"1NpmPvDGFZ_R8i5jPJ9H25pYGlqx0Dy-i","name":"My.Fault.2023.jpg"},{"kind":"drive#file","mimeType":"video/x-matroska","id":"1wW7M1fqTe6WvTHM9xo8q1Rxk3aw9GW1B","name":"Evildeadrise1080p.mkv"},{"kind":"drive#file","mimeType":"video/x-matroska","id":"1s0jdnGdtdg2aYWIMkwx8v2-EP7GBN678","name":"Fast_iX.mp4"},{"kind":"drive#file","mimeType":"video/mp4","id":"1LsD-LCIZA-80ppBlE-pfFqBmAfGPUZZR","name":"Fast_X.mp4"},{"kind":"drive#file","mimeType":"application/vnd.google-apps.folder","id":"1Nk_Ni2Ja2AU0djwy4Io-ISHGRoR8Ktkt","name":"Assets "},{"kind":"drive#file","mimeType":"text/javascript","id":"1OO4bXHCQ8M6SaffvW49f0P6qfraDcooB","name":"Usko"},{"kind":"drive#file","mimeType":"video/mp4","id":"1sdUoqvBKq2G4K7_SHUUrmPswEgllPoEz","name":"sftrangerthingss01e02.mp4"},{"kind":"drive#file","mimeType":"video/mp4","id":"12blkfBMK9mBNRRBwmN8Cqh0FBD3UELxl","name":"strangerthingss01e02.mp4"},{"kind":"drive#file","mimeType":"video/x-matroska","id":"1Jhd5m4cwefWZjTv_aSm7_H509Y8YBFhs","name":"GodzillavsKong.mkv"},{"kind":"drive#file","mimeType":"video/mp4","id":"1tCwSPBlk5c7vxnAXYUkTjdtzpEIIm83H","name":"VID20230624183754.mp4"},{"kind":"drive#file","mimeType":"video/mp4","id":"1LWa1EPtrI8nT6dG6Y2U_mc-hEAbW8uCk","name":"VID20230624183754.mp4"}];
//var updatedJSON = [{"kind":"drive#file","mimeType":"application/vnd.google-apps.folder","id":"13cPqUdKzJM4vuYX-GD0YvhtZgvZNa1aF","name":"Services"},{"kind":"drive#file","mimeType":"image/jpeg","id":"1NpmPvDGFZ_R8i5jPJ9H25pYGlqx0Dy-i","name":"My.Fault.2023.jpg"},{"kind":"drive#file","mimeType":"video/x-matroska","id":"1wW7M1fqTe6WvTHM9xo8q1Rxk3aw9GW1B","name":"Evildeadrise1080p.mkv"},{"kind":"drive#file","mimeType":"video/x-matroska","id":"1s0jdnGdtdg2aYWIMkwx8v2-EP7GBN678","name":"Fast_iX.mp4"},{"kind":"drive#file","mimeType":"video/mp4","id":"1LsD-LCIZA-80ppBlE-pfFqBmAfGPUZZR","name":"Fast_X.mp4"},{"kind":"drive#file","mimeType":"application/vnd.google-apps.folder","id":"1Nk_Ni2Ja2AU0djwy4Io-ISHGRoR8Ktkt","name":"Assets "},{"kind":"drive#file","mimeType":"text/javascript","id":"1OO4bXHCQ8M6SaffvW49f0P6qfraDcooB","name":"Usko"},{"kind":"drive#file","mimeType":"video/mp4","id":"1sdUoqvBKq2G4K7_SHUUrmPswEgllPoEz","name":"sftrangerthingss01e02.mp4"},{"kind":"drive#file","mimeType":"video/mp4","id":"12blkfBMK9mBNRRBwmN8Cqh0FBD3UELxl","name":"strangerthingss01e02.mp4"},{"kind":"drive#file","mimeType":"video/x-matroska","id":"1Jhd5m4cwefWZjTv_aSm7_H509Y8YBFhs","name":"GodzillavsKong.mkv"},{"kind":"drive#file","mimeType":"video/mp4","id":"1tCwSPBlk5c7vxnAXYUkTjdtzpEIIm83H","name":"VID20230624183754.mp4"},{"kind":"drive#file","mimeType":"video/mp4","id":"1LWa1EPtrI8nT6dG6Y2U_mc-hEAbW8uCk","name":"VID20230624183754.mp4"}];


  //get original json 
     var jsonData = await getJsonData();
     console.log("postgres" , jsonData);
    //console.log(jsonData);

  //get updated json 
  const files = await getfiles();
  //compare 

   const obj1Length = Object.keys(jsondetect(jsonData, files)).length;
  const obj2Length = Object.keys(jsondetect(files ,jsonData)).length;

//send output
  /*TODO APPLY DTOG , GTOD SERVICES IF NECESSARY*/
  if (obj1Length === obj2Length) {  
    console.log('The objects have the same length.');
  } else if (obj1Length > obj2Length) {
   // console.log('added');
      headersJSON = JSON.stringify(jsondetect(jsonData, files), null, 2);
 sendDiscordWebhook('https://discord.com/api/webhooks/1127586462888632442/rZ0jAcTLZPjTATiVcgqySR8nD81SBdqTS-Dvam9TA51NTcJdRlk9-7ZOjFajPt_C_zFY', headersJSON);
   console.log('added',jsondetect(jsonData, files));
  } else {
    //console.log('deleted');
      headersJSON = JSON.stringify(jsondetect(files ,jsonData), null, 2);
 sendDiscordWebhook('https://discord.com/api/webhooks/1127586462888632442/rZ0jAcTLZPjTATiVcgqySR8nD81SBdqTS-Dvam9TA51NTcJdRlk9-7ZOjFajPt_C_zFY', headersJSON);    
    console.log('deleted',jsondetect(files ,jsonData));
  }
       updateJsonData(JSON.stringify(files));

  }
else if (xGoogResourceState == 'sync') {
  console.log('sync');
}

  res.json("posted");
});