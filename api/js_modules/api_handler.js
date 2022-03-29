const { ApolloServer } = require('apollo-server-express');
const fs = require('fs');
const path = require("path");
const { getDb, connectToDb, getNextAvailableId } = require("./db.js");
const search = require("./search.js");
const weather = require("./weather.js");



// GraphQL Resolver and Functions
// console.log("Type of weather preview object: ", typeof weather.preview)
// console.log("Type of weather full object: ", typeof weather.full)
// console.log("Type of search location object: ", typeof search.location)

const resolvers = {
	Query: {
		getListSupportedCountriesBySearch: search.location_list,  // Implemented.
	  getPreviewWeather: weather.preview, // Implemented.
		getListSupportedCountriesByGPS: search.location_gps,  // Not implemented yet.
		getFullWeather : weather.full,  // Implemented.
  },
};


async function installHandler(app){
	const enableCors = (process.env.ENABLE_CORS || 'true') === 'true';
	// Initiate Graphql ApolloServer and middleware to listen to path /graphql.
	const schema_file_path = path.join(__dirname + "/../schema.graphql");
	const server = new ApolloServer({
		typeDefs: fs.readFileSync(schema_file_path, 'utf-8'),
		resolvers,
		formatError: (error) => { console.log(error); return error; },
	});
	await server.start();
	server.applyMiddleware({ app, path: '/graphql', cors: enableCors });
}

module.exports = { installHandler }