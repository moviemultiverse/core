# GraphQL for DARK_MATTER

GraphQL is a query language for APIs and a runtime for fulfilling those queries with your existing data.
This api will be used to fetch moviedata for doodstream and streamtape

```
## Types
  type Movie {
    movie_name: String!
    doodstream_code: String
    streamtape_code: String
  }

## Query

  type Query {
    movie(movie_name: String!): Movie
    allMovieNames: [String!]!
  }

```
