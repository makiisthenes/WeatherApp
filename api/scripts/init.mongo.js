

// Atlas URL  - replace UUU with user, PPP with password, XXX with hostname
// const url = 'mongodb+srv://UUU:PPP@cluster0-XXX.mongodb.net/issuetracker?retryWrites=true';

// mLab URL - replace UUU with user, PPP with password, XXX with hostname
// const url = 'mongodb://UUU:PPP@XXX.mlab.com:33533/issuetracker';


const { MongoClient, ServerApiVersion } = require('mongodb');
const url = 'mongodb://localhost/weatherapp';
const uri = "mongodb+srv://maki:FJDaAgfxkkO1lxFA@cluster0.3tlbi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db("maki").collection("weatherapp");
  // perform actions on the collection object
	console.log("Connected to MongoDB database.")
  client.close();
});