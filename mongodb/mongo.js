require('dotenv').config();
const { MongoClient } = require('mongodb');
const uri = process.env.DB_URI;
let mongoClient = new MongoClient(uri);

async function get_telecore_data() {
    try {
        await mongoClient.connect();
        const db = mongoClient.db('CORE');
        const collection = db.collection('movies');
        let telecoreData = await collection.find().toArray();
        return telecoreData;
    } catch (error) {
        console.error(error);
        throw error;
    } finally {
        await mongoClient.close();
    }
}

async function search_telecore_data(searchText) {
    try {
        await mongoClient.connect();
        const db = mongoClient.db('CORE');
        const collection = db.collection('movies');

        const query1 = { admin: "2104037869", movie_name: searchText };
        let telecoreData = await collection.findOne(query1);
        if (!telecoreData) {
            const query2 = { admin: "6270093925", movie_name: searchText };
            telecoreData = await collection.findOne(query2);
        }
        return telecoreData;
    } catch (error) {
        console.error(error);
        throw error;
    } finally {
        if (mongoClient) {
            await mongoClient.close();
        }
    }
}


async function set_telecore_data(dataToSave) {
    try {
      await mongoClient.connect();
      const db = mongoClient.db('CORE');
      const collection = db.collection('movies');
      const newData = {
        "movie_name": dataToSave.file_name,
        "admin": dataToSave.admin,
        "message_id": dataToSave.message_id,
        "size_mb": 0,
        "drive_code": "null",
        "streamtape_code": "null",
        "doodstream_code": "null",
        "is_series": true,
        "img_data": [],
        "is_reported": 0,
        "telegram": "Breaking.Bad.S03.E07.1080p.mkv"
      };
  
      await collection.insertOne(newData);
      console.log('Data saved successfully.');
      return true;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      if (mongoClient) {
        await mongoClient.close(); 
      }
    }
  }
  

module.exports = { get_telecore_data, search_telecore_data , set_telecore_data};
