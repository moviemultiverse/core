const { Pool } = require('pg');

const express = require('express');
var app = express();
app.use(express.json());
app.listen(3000);

const pool = new Pool({
  host: 'satao.db.elephantsql.com',
  port: 5432,
  database: 'iywyfbqc',
  user: 'iywyfbqc',
  password: 'qAGx55jepOzWXVmB2IZxn-F-rulL3zRR'
});

app.get('/', (req, res) => {
  var movie = req.query.movie;
  pool.query('SELECT * FROM moviedata WHERE movie_name = $1', [movie], (error, results) => {
    if (error) {
      console.error('Error executing query', error);
      res.status(500).send('Error retrieving users');
    } else {
      res.json(results.rows);
    }
  });
});

app.get('/update',(req , res) => {//ambigious
  var movieid = req.query.movieid;
  pool.query('UPDATE moviedata SET streamsb_code = $1 ,streamtape_code = $2 , doodstream_code = $3 , upstream_code = $4 WHERE drive_code = $5;',
    [movieid,movieid,movieid,movieid,movieid], (error, results) => {
    if (error) {
      console.error('Error executing query', error);
      res.status(500).send('Error retrieving users');
    } else {
      res.json(results.rows);
    }
  });
});
app.get('/streamsb',(req , res) => {
  var movieid = req.query.movieid;
  var streamsb_code = req.query.streamsb;
  pool.query('UPDATE moviedata SET streamsb_code = $1  WHERE drive_code = $2;',
    [streamsb_code,movieid], (error, results) => {
    if (error) {
      console.error('Error executing query', error);
      res.status(500).send('Error retrieving users');
    } else {
      res.json(results.rows);
    }
  });
});
app.get('/streamtape',(req , res) => {
  var movieid = req.query.movieid;
  var streamtape_code = req.query.streamtape;
  pool.query('UPDATE moviedata SET streamtape_code = $1  WHERE drive_code = $2;',
    [streamtape_code,movieid], (error, results) => {
    if (error) {
      console.error('Error executing query', error);
      res.status(500).send('Error retrieving users');
    } else {
      res.json(results.rows);
    }
  });
});
app.get('/doodstream',(req , res) => {
  var movieid = req.query.movieid;
  var doodstream_code = req.query.doodstream;
  pool.query('UPDATE moviedata SET doodstream_code = $1  WHERE drive_code = $2;',
    [doodstream_code,movieid], (error, results) => {
    if (error) {
      console.error('Error executing query', error);
      res.status(500).send('Error retrieving users');
    } else {
      res.json(results.rows);
    }
  });
});
app.get('/upstream',(req , res) => {
  var movieid = req.query.movieid;
  var upstream_code = req.query.upstream;
  pool.query('UPDATE moviedata SET upstream_code = $1  WHERE drive_code = $2;',
    [upstream_code,movieid], (error, results) => {
    if (error) {
      console.error('Error executing query', error);
      res.status(500).send('Error retrieving users');
    } else {
      res.json(results.rows);
    }
  });
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


module.exports = insertuser;
module.exports = updateJsonData;
module.exports = getJsonData;

/*
README 
this data api is for server to data server
eg. 
http://localhost:3000/?movie=myfault
*/