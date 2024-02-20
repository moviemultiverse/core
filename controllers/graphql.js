const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});


const typeDefs = `
  scalar JSON
  scalar JSONObject

  type Series {
    series_name: String!
    moviename_ref: JSON  
  }
  type Movie {
    movie_name: String!
    size_mb: String
    streamtape_code: String
    doodstream_code: String
    img_data: JSON  
    is_reported: Int
    telegram: String
  }

  type Query {
    movie(movie_name: String!): Movie
    movieseries(movie_name: String!): Movie
    series(series_name: String!): Series    
    allMovieNames: [String!]!
    allSeriesNames: [String!]!
    totalsize: JSONObject!
    movieSearch(query: String!): [Movie!]!
    version: String!
  }

  type Mutation {
    report(movie_name: String!): Movie
  }
`;


const resolvers = {
  Query: {
    movie: async (_, { movie_name }) => {
      try {
        const query = 'SELECT * FROM moviedata WHERE movie_name = $1 AND is_series = false;';
        const values = [movie_name];
        const result = await pool.query(query, values);
        return result.rows[0];
      } catch (error) {
        console.error('Error executing query', error);
        throw new Error('Error retrieving movie');
      }
    },
    movieseries: async (_, { movie_name }) => {
      try {
        const query = 'SELECT * FROM moviedata WHERE movie_name = $1 ;';
        const values = [movie_name];
        const result = await pool.query(query, values);
        return result.rows[0];
      } catch (error) {
        console.error('Error executing query', error);
        throw new Error('Error retrieving movie');
      }
    },
    series: async (_, { series_name }) => {
      try {
        const query = 'SELECT * FROM series WHERE series_name = $1 ';
        const values = [series_name];
        const result = await pool.query(query, values);
        return result.rows[0];
      } catch (error) {
        console.error('Error executing query', error);
        throw new Error('Error retrieving movie');
      }
    },
    allMovieNames: async () => {
      try {
        const query = 'SELECT movie_name FROM moviedata WHERE is_series = false;';
        const result = await pool.query(query);
        return result.rows.map(row => row.movie_name);
      } catch (error) {
        console.error('Error executing query', error);
        throw new Error('Error retrieving movie names');
      }
    },
    allSeriesNames: async () => {
      try {
        const query = 'SELECT series_name FROM series ';
        const result = await pool.query(query);
        return result.rows.map(row => row.series_name);
      } catch (error) {
        console.error('Error executing query', error);
        throw new Error('Error retrieving movie names');
      }
    },
    totalsize: async () => {
      try {
        const query = 'SELECT SUM(size_mb) as total_size FROM moviedata';
        const result = await pool.query(query);
        const totalSize = result.rows[0].total_size; // Get the total_size from the first row

        return { total_size: totalSize }; // Wrap the totalSize in a JSONObject
      } catch (error) {
        console.error('Error executing query', error);
        throw new Error('Error retrieving movie names');
      }
    },
    version:async () => {
      try {
        const query = 'SELECT version FROM blackhole_version';
        const result = await pool.query(query);
        return result.rows[0].version;
      } catch (error) {
        console.error('Error executing query', error);
        throw new Error('Error retrieving movie names');
      }
    },
    movieSearch: async (_, { query }) => {
      try {
        const searchQuery = `%${query.toLowerCase()}%`;
        const sqlQuery = 'SELECT * FROM moviedata WHERE lower(movie_name) LIKE $1';
        const result = await pool.query(sqlQuery, [searchQuery]);
        return result.rows;
      } catch (error) {
        console.error('Error executing query', error);
        throw new Error('Error searching movies');
      }
    },
  },
Mutation: {
  report: async (_, { movie_name }) => {
    try {
      const query = 'UPDATE moviedata SET is_reported = is_reported + 1 WHERE movie_name = $1 RETURNING *';
      const values = [movie_name];
      const result = await pool.query(query, values);
      return result.rows[0]; // Access the is_reported value from the first row
    } catch (error) {
      console.error('Error executing query', error);
      throw new Error('Error reporting movie');
    }
  },
},

};

module.exports = {typeDefs ,resolvers};