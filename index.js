const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});

const axios = require('axios');
const { google } = require('googleapis');
const fs = require('fs');
const { v4: uuidv4, validate: isUUID } = require('uuid');
const { JWT } = require('google-auth-library');
const { Octokit } = require("@octokit/rest");
const credentials = require('./drive-download-389811-b229f2e27ed8.json');
const githubToken = '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'; 
require('dotenv').config();
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { GraphQLJSON, GraphQLJSONObject } = require('graphql-type-json');
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const octokit = new Octokit({
  auth: githubToken,
});
const express = require('express');
const app = express();
app.use(express.json());

async function insertuser(authClient, fileId, emailAddress, role) {
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

const uuid_route = require("./routes/uuid_route");
const public_api = require("./routes/public_api");
const admin = require("./routes/admin");
const main_route = require("./routes/main");
const { typeDefs, resolvers } = require("./controllers/graphql");
const port = process.env.PORT || 3000;
const server = new ApolloServer({ typeDefs, resolvers });

server.start().then(() => {
  app.use(expressMiddleware(server));
});

app.use("/", uuid_route);
app.use("/", public_api);
app.use("/", admin);
app.use("/", main_route);
app.listen(port, () => {
  console.log(` Server ready at http://localhost:${port}`);
});

//-----------------------------------FOR DEEPLINKING WITH GITHUB FOR ANDROID-------------------------------------------------------
app.get('/.well-known/assetlinks.json', (req, res) => {
   res.send('[{\
  "relation": ["delegate_permission/common.handle_all_urls"],\
  "target" : { "namespace": "android_app", "package_name": "com.example.blackhole",\
               "sha256_cert_fingerprints": ["2E:19:FA:29:4C:5E:84:96:46:B5:4E:C0:06:FC:46:C7:D9:17:5F:27:81:EB:89:84:47:AC:FB:C3:91:6E:DF:71"] }\
}]');
});

/*
app.get('/', (req, res) => {
  // Set the Access-Control-Allow-Origin header to allow requests from any origin
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Set the Content-Type header to indicate JSON data
  res.setHeader('Content-Type', 'application/json');
  // Respond with the JSON data 'files'
  res.json('Server running successfully');
});
*/
app.get('/',(req,res)=>{
  res.sendFile(__dirname +'/docs/README.md');
});
app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});
app.get('/callback', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});

//TODO get gtod for series is same as atomic movies

app.get('/noti', function(req, res) {
  var notificationUrl = req.query.url;//https://30be-157-34-122-53.ngrok-free.app/post
res.json(createDriveNotificationChannel(notificationUrl));
//TODO it will have sync data errors due to inconsistentscy in data noti....
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




function arrayToObject(array) {
  const object = {};

  for (let i = 0; i < array.length; i++) {
    const item = array[i];
    const keys = Object.keys(item);

    for (let j = 0; j < keys.length; j++) {
      const key = keys[j];
      object[key] = item[key];
    }
  }

  return object;
}

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
        return arrayToObject(jsonData);
   // console.log('JSON data:', JSON.stringify(jsonData));
  } catch (error) {
    console.error('Error retrieving JSON data:', error);
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

app.post("/post", async (req, res) => {
const jsondetect = require('./jsondetect.js'); 

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
     var data = await getJsonData();
     const stored_json = data.var;
     //console.log("postgres" , stored_json);
    //console.log(jsonData);

  //get updated json 
  const updated_json = await getfiles();
  //compare 
   const obj1Length = Object.keys(jsondetect(stored_json, updated_json)).length;
  const obj2Length = Object.keys(jsondetect(updated_json ,stored_json)).length;

//send output
  /*TODO APPLY DTOG , GTOD SERVICES IF NECESSARY*/
 if (obj1Length > obj2Length) {
      headersJSON = JSON.stringify(jsondetect(stored_json, updated_json), null, 2);
 //sendDiscordWebhook('https://discord.com/api/webhooks/1127586462888632442/rZ0jAcTLZPjTATiVcgqySR8nD81SBdqTS-Dvam9TA51NTcJdRlk9-7ZOjFajPt_C_zFY', headersJSON);
  // console.log('added',jsondetect(stored_json, updated_json));
  } else {
      headersJSON = JSON.stringify(jsondetect(updated_json ,stored_json), null, 2);
 //sendDiscordWebhook('https://discord.com/api/webhooks/1127586462888632442/rZ0jAcTLZPjTATiVcgqySR8nD81SBdqTS-Dvam9TA51NTcJdRlk9-7ZOjFajPt_C_zFY', headersJSON);    
  //  console.log('deleted',jsondetect(updated_json ,stored_json));
  }
    console.log('new',jsondetect(stored_json, updated_json));
       updateJsonData(JSON.stringify(updated_json));
if ( jsondetect(stored_json, updated_json) !== []) {
    console.log('name',jsondetect(stored_json, updated_json)[0].name);
    console.log('id',jsondetect(stored_json, updated_json)[0].id);
    console.log('type',jsondetect(stored_json, updated_json)[0].mimeType);

 
    if(jsondetect(stored_json, updated_json)[0].mimeType == 'video/mp4' ||
    jsondetect(stored_json, updated_json)[0].mimeType ==  'video/x-matroska' )
    {
           createRepository(jsondetect(stored_json, updated_json)[0].id , 0);
           /*
           TODO service isn't  able to delete the file created with me
           not even named error not granted write permission to app
           currently it will use file to dtog operation and reupload to uploaded folder
           */
    }
  }}
else if (xGoogResourceState == 'sync') {
  console.log('sync');
}

  res.json("posted");
});