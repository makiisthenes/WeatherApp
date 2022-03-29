const reverse = require('reverse-geocode')
// https://www.npmjs.com/package/reverse-geocode
// Obtain JSON files for all locations from URL: http://download.geonames.org/export/dump/


// Instead of generating the data required ourselves, we will just generate it using https://weatherapi.com/docs/.


function getCountryListGPS(_, { gps_qry }){
	// Return a list of supported countries based on gps.
	const {lat, lon} = gps_qry; // GPS Input Type.
	const {city, country, state } = getCityCountry(lat, lon);
	
	return ""
}

function getCityCountry(lat, lon){
	
	return {}
}



module.exports = { getCountryListGPS };