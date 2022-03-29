require('dotenv').config({ path: 'process.env' });

const { MongoClient, ServerApiVersion } = require('mongodb');


let db;

async function connectToDb() {
  const dbUrl = process.env.DB_URL || 'mongodb://localhost/weatherapp';
  const client = new MongoClient(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
  // Connecting to Database
  await client.connect();
  console.log('Connected to MongoDB database @', dbUrl);
  db = client.db();
}

async function getNextAvailableId(name) {
  const result = await db.collection('counters').findOneAndUpdate(
    { _id: name },
    { $inc: { current: 1 } },
    { returnOriginal: false },
  );
  return result.value.current;
}

function getDb(){
	return db
}

module.exports = { connectToDb, getNextAvailableId, getDb }