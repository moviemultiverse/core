const express = require("express");
const { createHandler } = require( 'graphql-http/lib/use/express');
const { GraphQLSchema, GraphQLObjectType, GraphQLString } = require("graphql");
const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      hello: {
        type: GraphQLString,
        resolve: () => 'world',
      },
      hello1: {
        type: GraphQLString,
        resolve: () => 'world1',
      },
    },
  }),
});
const app = express();
app.use(
  "/graphql",
  createHandler({
    schema: schema,
  })
);
app.listen(4000, () => {
  console.log("Running a GraphQL API server at localhost:4000/graphql");
});

//curl -X POST   -H "Content-Type: application/json"   -d '{"query": "{ hello ,hello1 }"}'   http://localhost:4000/graphql