const MongoClient = require('mongodb').MongoClient;


const uri = 'mongodb://localhost:27017/?retryWrites=true&w=majority';
const client = new MongoClient(uri);

// Define an async function and immediately invoke it
(async () => {
  try {
    await client.connect();
    console.log('Connected to MongoDB 1');

    const sourceDatabase = client.db('CORE');
    const destinationDatabase = client.db('CORE');

    const sourceCollection = sourceDatabase.collection('user1_to_bot');
    const destinationCollection = destinationDatabase.collection('movies');

    // Step 1: Find all series documents
    const seriesDocuments = await sourceCollection.find({}).toArray();
    console.log('Connected to MongoDB 2');
    // Step 2: Move and insert as movie documents into the destination collection
    const bulkOperations = seriesDocuments.map(seriesDocument => {
      const movieDocument = {
        "movie_name": seriesDocument.file_name,
        "size_mb": 0,
        "drive_code": "null",
        "streamtape_code": "null",
        "doodstream_code": "null",
        "is_series": false,
        "img_data": ["b58aa9ef-8f9b-4cdb-95bb-89a0f2b63e24"],
        "is_reported": 0,
        "telegram": seriesDocument.file_name,
        "admin": seriesDocument.admin,
        "message_id": seriesDocument.message_id,
      };

      return {
        insertOne: {
          document: movieDocument,
        },
      };
    });
    console.log('Connected to MongoDB 3');
    try {
      // Execute bulk operations in the destination collection
      await destinationCollection.bulkWrite(bulkOperations);
      console.log('Connected to MongoDB 4');
    } catch (error) {
      console.error('MongoDB operation error:', error);
    }

  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  } finally {
    client.close();
  }
})();
