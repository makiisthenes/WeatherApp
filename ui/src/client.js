// This file is a Client to run API calls to our own custom-built API
const dateRegex = new RegExp('^\\d\\d\\d\\d-\\d\\d-\\d\\d');

function json_date_reviver(key, value) {
	if (dateRegex.test(value)) return new Date(value);
	return value;
}

async function graph_ql_fetch(query, variables = {}) {
	// API send function
	try {
		const response = await fetch(process.env.GRAPHQL_ENDPOINT || 'http://localhost:3000/graphql', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				query,
				variables
			})
		})
		const body = await response.text();
		const result = JSON.parse(body, json_date_reviver);
		if (result.errors) {
			console.log("Errors: ", result.errors)
			const error = result.errors[0]
			if (error.extensions.code === "BAD_USER_INPUT") {
				const details = error.extensions.exception.errors.join('\n')
				alert(`${error.message}: \n ${details}`)
			} else {
				alert(`${error.extensions.code}: ${error.message}`)
			}
		}
		return result.data
	} catch (e) {
		console.log(`Error in sending data to server: ${e.message}`);
	}
}

export async function searchCity(search_query) {
	// API to search for a city
	let query = `query GetListSupportedCountriesBySearch($query: String) {
  getListSupportedCountriesBySearch(query: $query) {
    id
    location_name
    location_country
  }
	}`
	return await graph_ql_fetch(query, {"query": search_query});
}


export async function getWeatherForCityId(id){
	// API to get weather details for given city id (from our API)
	let query = `query GetPreviewWeather($getPreviewWeatherId: Int!) {
  getPreviewWeather(id: $getPreviewWeatherId) {
    id
    location_city
    location_country
    temp_c
    is_day
    rain_chance
    daily_will_it_rain
    hashtag_desc
    emoji_desc
  }
}`
	return await graph_ql_fetch(query, {"getPreviewWeatherId": id});
}


// Saving bandwidth by sending smaller message.
export async function getWeatherRefreshForCityId(id){
	let query = `query GetPreviewWeather($getPreviewWeatherId: Int!) {
  getPreviewWeather(id: $getPreviewWeatherId) {
    id
    temp_c
    rain_chance
    daily_will_it_rain
    hashtag_desc
    emoji_desc
  }
}`
	return await graph_ql_fetch(query, {"getPreviewWeatherId": id});
}



