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
const { v4: uuidv4 } = require('uuid');
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