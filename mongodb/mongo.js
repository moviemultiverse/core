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
/*
async function update_data() {
  try {
    await mongoClient.connect();
    const db = mongoClient.db('CORE');
    const collection = db.collection('movies');
    let telecoreData = await collection.updateMany(
      { "img_data": [] },
      { $set: { "img_data": ["b58aa9ef-8f9b-4cdb-95bb-89a0f2b63e24"] } }
    );

    return telecoreData;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await mongoClient.close();
  }
}
*/
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
        "size_mb": dataToSave.size_mb,
        "drive_code": "null",
        "streamtape_code": "null",
        "doodstream_code": "null",
        "is_series": dataToSave.is_series,
        "img_data": ["b58aa9ef-8f9b-4cdb-95bb-89a0f2b63e24"],
        "is_reported": 0,
        "telegram": dataToSave.file_name
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
