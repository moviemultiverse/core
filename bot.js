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
const fs = require('fs');
const { v4: uuidv4, validate: isUUID } = require('uuid');
const express = require('express');
var app = express();
app.use(express.json());



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