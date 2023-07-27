const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { GraphQLJSON, GraphQLJSONObject } = require('graphql-type-json');
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer');
const express = require('express');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const pool = new Pool({
  host: 'satao.db.elephantsql.com',
  port: 5432,
  database: 'iywyfbqc',
  user: 'iywyfbqc',
  password: 'qAGx55jepOzWXVmB2IZxn-F-rulL3zRR'
});

const typeDefs = `
scalar JSON
scalar JSONObject

type Movie {
  movie_name: String!
  doodstream_code: String
  streamtape_code: String
  img_data: JSONObject  
}

type Query {
  movie(movie_name: String!): Movie
  allMovieNames: [String!]!
}

`;

const resolvers = {
  Query: {
    movie: async (parent, { movie_name }) => {
      try {
        const query = 'SELECT * FROM moviedata WHERE movie_name = $1';
        const values = [movie_name];
        const result = await pool.query(query, values);
        return result.rows[0];
      } catch (error) {
        console.error('Error executing query', error);
        throw new Error('Error retrieving movie');
      }
    },
    allMovieNames: async () => {
      try {
        const query = 'SELECT movie_name FROM moviedata';
        const result = await pool.query(query);
        return result.rows.map(row => row.movie_name);
      } catch (error) {
        console.error('Error executing query', error);
        throw new Error('Error retrieving movie names');
      }
    },
  },
};

const app = express();
const httpServer = http.createServer(app);

// Set up Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

// Start the Apollo Server before using expressMiddleware
async function startServer() {
  await server.start();
  app.use(
    cors(),
    bodyParser.json(),
    expressMiddleware(server),
  );

  httpServer.listen({ port: 4000 }, () => {
    console.log(`🚀 Server ready at http://localhost:4000`);
  });
}

startServer().catch(err => console.error(err));
