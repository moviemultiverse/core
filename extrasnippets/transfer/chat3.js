const MongoClient = require('mongodb').MongoClient;

const uri = 'mongodb://localhost:27017/?retryWrites=true&w=majority';
const client = new MongoClient(uri);

async function set_telecore_data(dataToSave) {
  try {
    await client.connect(); // Corrected from mongoClient.connect()
    const db = client.db('CORE');
    const collection = db.collection('user1_to_bot');

    // Add the additional data with admin and message_id
    const newData = {
      "movie_name": dataToSave.file_name,
      "size_mb": 0,
      "drive_code": "null",
      "streamtape_code": "null",
      "doodstream_code": "null",
      "is_series": 0,
      "img_data": ["b58aa9ef-8f9b-4cdb-95bb-89a0f2b63e24"],
      "is_reported": 0,
      "telegram": "Breaking.Bad.S03.E07.1080p.mkv",
      "admin": dataToSave.admin,
      "message_id": dataToSave.message_id
    };

    await collection.insertOne(newData);

    console.log('Data saved successfully.');
    return true;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    if (client) {
      await client.close(); // Corrected from mongoClient.close()
    }
  }
}

// Calling the function
(async () => {
  await set_telecore_data(
    {
      "admin": "nobody",
      "message_id": 936,
      "file_name": "Sweet.Home.S02E03.1080p.mkv"
    }
  );
})();
