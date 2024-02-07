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



// Display List
router.getuuid = async (req, res) => {

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
  };


router.createuuid = async (req,res)=>{
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
 };


 router.fetchtoken =  async (req , res)=>{
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
 };


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

router.callback = async (req, res) => {
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
};

 module.exports = router;