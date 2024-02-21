const { createClient } = require('redis');
require('dotenv').config();

async function set2redis(key, value) {
    //const client = createClient();
    const client = createClient({
        url: process.env.REDIS_AUTH_KEY
      });

  client.on('error', err => console.log('Redis Client Error', err));

  try {
    await client.connect();

    await client.set(key, value);

    await client.disconnect();
    return true;
  } catch (e) {
    console.log(e);
  }
}

async function get2redis(key) {
    //const client = createClient();
    const client = createClient({
        url: process.env.REDIS_AUTH_KEY
      });

  client.on('error', err => console.log('Redis Client Error', err));

  try {
    await client.connect();

    const value = await client.get(key);

    await client.disconnect();
    return value;
  } catch (e) {
    console.log(e);
  }
}
/*
(async () => {
  const key = 'admin1';
  const value = 'value';
  let data;
  (await set2redis(key , value))? data = await get2redis(key): console.log('Error');
  console.log('Value:', data);
})();*/
 module.exports = { set2redis, get2redis };