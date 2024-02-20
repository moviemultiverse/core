require('dotenv').config();
const { MongoClient } = require('mongodb');

async function get_telecore_data() {
    const uri = process.env.DB_URI;
    try {
        let mongoClient = new MongoClient(uri);
        await mongoClient.connect();
        const db = mongoClient.db('CORE');
        const collection = db.collection('tele_data');
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
    const uri = process.env.DB_URI;
    let mongoClient;

    try {
        mongoClient = new MongoClient(uri);
        await mongoClient.connect();
        const db = mongoClient.db('CORE');
        const collection = db.collection('user1_to_bot');

        const query1 = { admin: "2104037869", file_name: searchText };
        let telecoreData = await collection.findOne(query1);
        if (!telecoreData) {
            const query2 = { admin: "6270093925", file_name: searchText };
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
    const uri = process.env.DB_URI;
    let mongoClient;

    try {
        mongoClient = new MongoClient(uri);
        await mongoClient.connect();
        const db = mongoClient.db('CORE');
        const collection = db.collection('user1_to_bot');
        await collection.insertMany(dataToSave);

        console.log('Data saved successfully.');
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
