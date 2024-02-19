require('dotenv').config();
const MongoClient = require("mongodb").MongoClient;
const MONGODB_URI =process.env.DB_URI;
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }
  const client = await MongoClient.connect(MONGODB_URI);

  const db = await client.db("CORE");

  cachedDb = db;
  return db;
}

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const db = await connectToDatabase();
  const limit = parseInt(event.queryStringParameters && event.queryStringParameters.limit) || 20;
  let response;

  if (event.queryStringParameters.tele_data) {
    response = await db.collection("tele_data").find({}).limit(limit).toArray();
  } else if (event.queryStringParameters.movies) {
    response = await db.collection("movies").find({}).limit(limit).toArray();
  } else if (event.queryStringParameters.series) {
    response = await db.collection("series").find({}).limit(limit).toArray();
  } else {
    response = "use ? tele_data, movies, or series in queryStringParameters to true";
  }

  const responseObject = {
    statusCode: 200,
    body: JSON.stringify(response),
  };

  return responseObject;
};
