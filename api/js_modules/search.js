const { UserInputError } = require('apollo-server-express');
const { getDb, getNextAvailableId } = require("./db.js");



async function location_gps(_, { lat, lon }){
	// We will use local-reverse-geocoder to remove dependency on online services such as google maps api.
	// We will do this afterwards as its giving us a big headache to implement by ourselves, will look at alternatives.
}




async function location_list(_, { query }) 
{
	// Return a list of supported countries based on search query, regex on name index on database.
	const db = getDb();
	validate(query);
	const locations = await db.collection('weatherapp').find({
		$or: [
			{
				'location.name': {
					$regex: query,
					$options: 'i'
				}
			},
			{
				'location.region': {
					$regex: query,
					$options: 'i'
				}
			},
			{
				'location.country': {
					$regex: query,
					$options: 'i'
				}
			}
    	]
	}).limit(10).toArray();
	
	if (locations !== null){
		// Format to fit expected return of schema.graphql file.
		// console.log("Returned from resolver data ", locations);
		const return_array = locations.map(schema_formatter);
		
	
		console.log("Locations object", return_array);
		return return_array;
		
	}
	
}

function schema_formatter(value){
	const schema_obj = {
		"id": value["id"],
		"lat": String(value["location"]["lat"]),
		"lon": String(value["location"]["lon"]),
		"location_name": value["location"]["name"],
		"location_region": value["location"]["region"],
		"location_country": value["location"]["country"],
		"location_tz_id": value["location"]["tz_id"],
		"location_localtime_epoch": value["location"]["localtime_epoch"],
		"location_localtime": value["location"]["localtime"]
	};
	
	return schema_obj;
	
}


function validate(query) {
	// Assign validation constraints on search query.
	const errors = [];
	return
}




module.exports = {
	location_list,
	location_gps
}
