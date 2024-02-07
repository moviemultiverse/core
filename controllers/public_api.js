var express = require('express');
var router = express.Router();
const { v4: uuidv4, validate: isUUID } = require('uuid');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});

const { get_telecore_data } = require('../mongodb/mongo');
const { MongoClient } = require('mongodb');


router.get_telecore_data = async (req, res) => {
    try {
     let telecoreData = await get_telecore_data();
        res.json( telecoreData );
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error retrieving telecore data' });
    }
};


router.movie_data = async (req, res) => {
    var movie = req.query.movie;
    pool.query('SELECT * FROM moviedata', (error, results) => {
      if (error) {
        console.error('Error executing query', error);
        res.status(500).send('Error retrieving users');
      } else {
        res.json(results.rows);
      }
    });
};

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


router.api =  async (req, res) => {
  const user_id = req.query.id; 
  const file_id = req.query.fileid;
main(user_id,file_id);
  
 /* res.send({
    'user_id': user_id,
    'file_id': file_id
  });*/
  res.redirect('https://ss0809.github.io/Dark_matter/?fileid='+file_id);
};
module.exports = router;