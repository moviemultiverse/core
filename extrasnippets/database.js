const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});


const express = require('express');
var app = express();
app.use(express.json());
app.listen(3000);


app.get('/movie', (req, res) => {
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

app.get('/movie', (req, res) => {
  var movie = req.query.movie;
  pool.query('SELECT * FROM moviedata',  (error, results) => {
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


/*
README 
this data api is for server to data server
eg. 
http://localhost:3000/?movie=myfault
*/