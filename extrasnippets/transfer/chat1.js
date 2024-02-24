const MongoClient = require('mongodb').MongoClient;

const uri = 'mongodb://localhost:27017/?retryWrites=true&w=majority';
const client = new MongoClient(uri);

// Define an async function and immediately invoke it
(async () => {
  try {
    await client.connect();
    console.log('Connected to MongoDB 1');

    const destinationDatabase = client.db('CORE');
    const destinationCollection = destinationDatabase.collection('movies');

    // Update existing documents in the 'movies' collection to include 'admin' and 'message_id'
    await destinationCollection.updateMany(
      { "admin": { $exists: false }, "message_id": { $exists: false } },
      {
        $set: {
          "admin": "sudo",  // Replace with the actual admin value
          "message_id": 0,  // Replace with the actual message_id value
        }
      }
    );

    console.log('Connected to MongoDB 2');

  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  } finally {
    client.close();
  }
})();
