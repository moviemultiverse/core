const axios = require('axios');
const TelegramBot = require('node-telegram-bot-api');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();
// Replace 'YOUR_TELEGRAM_BOT_TOKEN' with the token you obtained from BotFather
const token = process.env.TOKEN ;

// Create a new instance of the TelegramBot
const bot = new TelegramBot(token, { polling: true });

  
// Handle incoming messages
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const messageText = msg.text;

  if (messageText === '/start') {
    bot.sendMessage(
      chatId,
      'Welcome! This is a movie search bot. To use it, simply send the name of a movie you want to search for, and I will provide you with the available links.\n\nPlease enter a movie name to search.'
    );
  } else {
    try {
      const movies = await searchMovie(messageText);
      if (movies.length > 0) {
        const movieDetails = movies.map(
          (movie) =>
            `${movie.movie_name} - (${movie.size_mb}MB)\n` +
            `https://ss0809.github.io/cdn/subdir1/?moviename=${movie.movie_name}&streamtape_code=${movie.streamtape_code}&doodstream_code=${movie.doodstream_code}`
        );
        const message = `Movies found:\n${movieDetails.join('\n')}`;
        bot.sendMessage(chatId, message);
      } else {
        bot.sendMessage(chatId, 'Movie not found.');
      }
    } catch (error) {
      console.error('Error searching movies', error);
      bot.sendMessage(chatId, 'An error occurred while searching movies.');
    }
  }
});

async function searchMovie(query) {
  const graphqlEndpoint = 'http://localhost:'+process.env.PORT+'/graphql'; // Replace with the actual GraphQL API URL
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

  return data.data.movieSearch;
}






/*







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

*/