async function searchMovie(chatId, query) {
  try {
    const graphqlEndpoint = 'https://graphql-pyt9.onrender.com'; // Replace with the actual GraphQL API URL
    const requestBody = {
      query: `
        query ExampleQuery($query: String!) {
          movieSearch(query: $query) {
            movie_name
            doodstream_code
            streamtape_code
            size_mb
          }
        }
      `,
      variables: {
        query: query,
      },
    };

    const response = await axios.post(graphqlEndpoint, requestBody, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = response.data;

    if (data.errors) {
      throw new Error('Error searching movies');
    }

    const movies = data.data.movieSearch;
    if (movies.length > 0) {
      const movieDetails = movies.map(
        (movie) =>
          `${movie.movie_name}- (${movie.size_mb}MB) \n https://ss0809.github.io/cdn/subdir1/?moviename=${movie.movie_name}&streamtape_code=${movie.streamtape_code}&doodstream_code=${movie.doodstream_code}`
      );
      const message = `Movies found:\n${movieDetails.join('\n')}`;
      bot.sendMessage(chatId, message);
    } else {
      bot.sendMessage(chatId, 'Movie not found.');
    }
  } catch (error) {
    console.error('Error executing query', error);
    bot.sendMessage(chatId, 'An error occurred while searching movies.');
  }
}


/*
// Require the node-telegram-bot-api package
const TelegramBot = require('node-telegram-bot-api');

// Replace 'YOUR_TELEGRAM_BOT_TOKEN' with the token you obtained from BotFather
const token = '5829137130:AAF8i82RvKYq-FzkYLbSAYvXAgnOeiDKDOY';


// Create a new instance of the TelegramBot
const bot = new TelegramBot(token, { polling: true });


// Handle incoming messages
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const messageText = msg.text;

  if (messageText === '/start') {
    bot.sendMessage(chatId, 'Enter a movie name to search.');
  } else {
    searchMovie(chatId, messageText);
  }
});

*/
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
const { v4: uuidv4, validate: isUUID } = require('uuid');
const { JWT } = require('google-auth-library');
const { Octokit } = require("@octokit/rest");
const credentials = require('./drive-download-389811-b229f2e27ed8.json');
const githubToken = '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'; 
const octokit = new Octokit({
  auth: githubToken,
});
const express = require('express');
var app = express();
app.use(express.json());

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
async function getvidFiles() {
  try {
    const auth = new google.auth.JWT(
      credentials.client_email,
      null,
      credentials.private_key,
      ['https://www.googleapis.com/auth/drive']
    );

    const drive = google.drive({ version: 'v3', auth });
    const response = await drive.files.list({
      q: "mimeType='video/mp4' or mimeType='video/x-matroska'",
    });

    const mp4Files = response.data.files;

    if (mp4Files.length) {
      // console.log(mp4Files);
      return mp4Files;
    } else {
      console.log('No mp4 files found');
      return [];
    }
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
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
app.get('/createuuid',async (req,res)=>{
   var var_uuid = uuidv4();
   try {
    const client = await pool.connect();
    const query = `
     INSERT INTO uuidtable(uuid) VALUES ($1);
    `;
    const values = [var_uuid ];
    await client.query(query, values);
    client.release();
    console.log('user added successfully');
    res.json(var_uuid );
  } catch (error) {
    console.error('Error updating user insertion:', error);
    res.json(error);
  }
});

app.get('/getuuid', async (req, res) => {
  const uuid = req.query.uuid;
  const access_token = req.query.access_token;

  if (uuid != null && access_token != null && isUUID(uuid)) {
    try {
      const client = await pool.connect();
      const query = `
        UPDATE uuidtable SET access_token = $2 WHERE uuid = $1;
      `;
      const values = [uuid, access_token];
      await client.query(query, values);
      client.release();
      console.log('User updated successfully');
      res.json({ success: true });
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ error: 'Error updating user' });
    }
  } else {
    res.status(400).json({ error: 'Bad Request: Missing or Invalid UUID or Access Token' });
  }
});
app.get( '/fetchtoken' , async (req , res)=>{
   const uuid = req.query.uuid;
   if (uuid != null && isUUID(uuid)) {
    try {
      const client = await pool.connect();
      const query = `
        SELECT access_token FROM uuidtable WHERE uuid = $1;
      `;
      const values = [uuid];
      var result  = await client.query(query, values);
      client.release();
      console.log('token fetched successfully');
      res.json(result.rows[0].access_token);
    } catch (error) {
      console.error('Error updating user:', error);
      res.send('error');
    }
  } else {
    res.send('error');
  }
});

app.get('/.well-known/assetlinks.json', (req, res) => {
   res.send('[{\
  "relation": ["delegate_permission/common.handle_all_urls"],\
  "target" : { "namespace": "android_app", "package_name": "com.example.blackhole",\
               "sha256_cert_fingerprints": ["2E:19:FA:29:4C:5E:84:96:46:B5:4E:C0:06:FC:46:C7:D9:17:5F:27:81:EB:89:84:47:AC:FB:C3:91:6E:DF:71"] }\
}]');
});
app.get('/', (req, res) => {
  // Set the Access-Control-Allow-Origin header to allow requests from any origin
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Set the Content-Type header to indicate JSON data
  res.setHeader('Content-Type', 'application/json');
  // Respond with the JSON data 'files'
  res.json('files');
});
app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});
app.get('/callback', (req, res) => {
    res.sendFile(__dirname + '/login.html');
});

async function insertuser(user , email , picture) {
  try {
    const client = await pool.connect();
    const query = `
      INSERT INTO users_login_dark_matter (name, email ,picture) VALUES ($1, $2 ,$3);
    `;
    const values = [user , email , picture];
    await client.query(query, values);
    client.release();
    console.log('user added successfully');
  } catch (error) {
    console.error('Error updating user insertion:', error);
  }
}

app.post('/callback', (req, res) => {
  console.log(req.headers); // Access the posted data here
  const accessToken = req.headers.authorization.split('Bearer ')[1];
  console.log(accessToken);
  axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then(response => {
      // Extract email, name, and profile picture URL from the response
      const { email, name, picture } = response.data;
      if(insertuser(name,email,picture ))
      res.send(`Welcome, ${name} (${email}). Profile picture: ${picture}`);
      else
      res.json("error");
    })
    .catch(error => {
      // Handle the error if the request fails
      console.error('Error retrieving user profile:', error);
      res.status(500).send('Error retrieving user profile');
    });
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
  const workflowrepo = req.query.workflowrepo;
  const rerunworkflow = require('./rerunworkflows.js');
  const files = await rerunworkflow(workflowrepo);
  res.json(files);
});

app.get('/artifact',async (req , res) => {
const getWorkflowArtifacts = require('./artifact.js'); 
  var reponame = req.query.reponame;
res.json(await getWorkflowArtifacts(reponame));
});

app.get('/getfiles', async (req, res) => {
  try {
    const files = await getfiles();
    res.json(files);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.get('/getvidfiles', async (req, res) => {
  try {
    const files = await getvidFiles();
    res.json(files);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/movie_data', (req, res) => {
  var movie = req.query.movie;
  pool.query('SELECT * FROM moviedata', (error, results) => {
    if (error) {
      console.error('Error executing query', error);
      res.status(500).send('Error retrieving users');
    } else {
      res.json(results.rows);
    }
  });
});
app.get('/size', (req, res) => {
  var movie = req.query.movie;
  pool.query('SELECT SUM(size_mb) as total_size FROM moviedata', (error, results) => {
    if (error) {
      console.error('Error executing query', error);
      res.status(500).send('Error retrieving data');
    } else {
      // `results.rows` will contain an array with a single object
      // representing the sum of the 'size_mb' column as 'total_size'.
      // We can extract it and send it in the response.
      const totalSize = results.rows[0].total_size;
      res.json({ totalSize });
    }
  });
});


app.get('/getrepo', async (req, res) => {
    searchRepositories("ss08090", githubToken)
  .then((repos) => {
    //console.log( repos);
    res.json(repos);
  })
  .catch((err) => {
    console.error('Error:', err);
  });
});
async function searchRepositories(username, token) {
  const apiUrl = `https://api.github.com/search/repositories?q=user:${username}`;
  const headers = {
    Authorization: `token ${token}`,
  };

  try {
    const response = await axios.get(apiUrl, { headers });
    return response.data.items.map((repo) => repo.name);
  } catch (error) {
    console.error('Error fetching repositories:', error.message);
    return [];
  }
}

async function createrepopermission(file_id) {
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
    const role = 'writer';


    const drive = google.drive({ version: 'v3', auth: authClient });

    const permission = {
      role: role,
      type: 'anyone'
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
const createRepository = require('./createrepo.js');
app.get('/createrepo', async function (req, res) {
  try {
    var file_id = req.query.fileid;
    await createrepopermission(file_id);
    res.json(createRepository(file_id , 0));
  } catch (error) {
    res.status(500).json({ error: 'An error occurred during repository creation.' });
  }
});
/* used to create a repo with is_series = true config
app.get('/createreposeries', async function (req, res) {
  try {
    var file_id = req.query.fileid;
    await createrepopermission(file_id);
    res.json(createRepository(file_id , 1));
  } catch (error) {
    res.status(500).json({ error: 'An error occurred during repository creation.' });
  }
});*/


async function getseriesfolder(folderId) {
    const auth = new google.auth.JWT(
        credentials.client_email,
        null,
        credentials.private_key,
        ['https://www.googleapis.com/auth/drive']
    );

    const drive = google.drive({ version: 'v3', auth });

    try {
        const nameResponse = await drive.files.get({
            fileId: folderId,
            fields: 'name'
        });

        const childrenResponse = await drive.files.list({
            q: `'${folderId}' in parents and trashed = false`,
        });

        const folderName = nameResponse.data.name;
        const children = childrenResponse.data.files;

        return { folderName, children };
    } catch (error) {
        console.error("Error retrieving folder and children:", error.message);
        return null;
    }
}

app.get('/createreposeries', async function (req, res) {
    try {
        const folderId = req.query.folderId; // Assuming you're passing folderId as a query parameter
        console.log('folderId', folderId);
        const result = await getseriesfolder(folderId);
        console.log('result', result);
        if (result) {
            const children = result.children;

            // Now you can use 'children' to perform subsequent actions
            for (const child of children) {
                await createrepopermission(child.id);
                await createRepository(child.id, 1);
            }

            // Extract the series name from the folder
            const seriesName = result.folderName;

            // Create the movie reference object
            const movieReference = {
                children: children.map(child => child.name.replace(/\.mp4$/, '')) // Remove ".mp4" from child names
            };
            console.log(movieReference);

            // Save the movie reference to the database
            const client = await pool.connect();
            const insertQuery = `
                INSERT INTO public.series(series_name, moviename_ref)
                VALUES ($1, $2);
            `;
            const values = [seriesName, JSON.stringify(movieReference)]; // Assuming your DB column expects JSON data
            await client.query(insertQuery, values);
            client.release();

            res.json({ message: 'Repository creation and database insertion completed successfully.' });
        } else {
            console.log("Folder not found or error occurred.");
            res.status(404).json({ error: 'Folder not found or error occurred.' });
        }
    } catch (error) {
        console.error("An error occurred:", error);
        res.status(500).json({ error: 'An error occurred during repository creation and database insertion.' });
    }
});


//TODO get gtod for series is same as atomic movies

app.get('/noti', function(req, res) {
  var notificationUrl = req.query.url;//https://30be-157-34-122-53.ngrok-free.app/post
res.json(createDriveNotificationChannel(notificationUrl));
//TODO it will have sync data errors due to inconsistentscy in data noti....
});
app.get('/api', function(req, res) {
  const user_id = req.query.id; 
  const file_id = req.query.fileid;
main(user_id,file_id);
  
 /* res.send({
    'user_id': user_id,
    'file_id': file_id
  });*/
  res.redirect('https://ss0809.github.io/Dark_matter/?fileid='+file_id);
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

async function Mappeddata(jsonFiles, fileNamesArray) {
  const resultMap = {};

  for (const file of jsonFiles) {
    const fileNameWithoutExtension = file.name.replace(/\.[^/.]+$/, ''); // Remove .mp4 extension
    const found = fileNamesArray.includes(fileNameWithoutExtension);
    resultMap[fileNameWithoutExtension] = found;
  }

  // Convert resultMap to JSON using JSON.stringify()
  const resultMapJSON = JSON.stringify(resultMap);

  return resultMapJSON;
}


function addDataToJSON(mainJSON, newDataJSON) {
  for (const newDataObj of newDataJSON) {
    for (const name in newDataObj) {
      const matchingData = mainJSON.find((data) => data.name.replace(/\.[^/.]+$/, '') === name);
      if (matchingData) {
        matchingData.check = newDataObj[name];
      }
    }
  }
  return mainJSON;
}


app.get('/getmappeddata', async function(req, res) {
  try {
    const files = await getvidFiles();
    const repos = await searchRepositories("ss08090", githubToken);
    const result = await Mappeddata(files, repos);
    try{
    const updatedJSON = addDataToJSON(files, [JSON.parse(result)]);
    res.json(updatedJSON);
    }
    catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "An error occurred" });
  }
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "An error occurred" });
  }
});



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








