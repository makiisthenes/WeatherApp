require('dotenv').config({ path: 'process.env' });
// This involves another level of difficulty. As there are 2 modes, full weather forecast and real time requests, we will have to deal with them in different ways.
// We will first deal with long term forecasts as they are more easier to handle compared to the other.
const { getDb, connectToDb, getNextAvailableId } = require("./db.js");
const axios = require("axios");

// There will be probably errors with checking if data is still valid. Check function specific to that.



async function full(_, { id }){
	const db = getDb();
	validate(id);
	const location = await db.collection('weatherapp').find({'id': id}).toArray();
	if (location !== undefined){
		// console.log("Location is not undefined.")
		const qry = `${location[0]["location"]["region"]},${location[0]["location"]["country"]}`;

		// Check if object has a full week_data entry and is valid.
		let full_obj = location[0]["weather"]["full"]
		if (full_obj !== null ){

			console.log("Full object is not null.")
			// Check if current data is valid.
			let data_epoch = full_obj["week_data"][0]["date"]
			const obtained_epoch = new Date(data_epoch);
			const current_epoch  = new Date();

			/*
			console.log(obtained_epoch.getDay() === current_epoch.getDay(),  obtained_epoch.getDay(), current_epoch.getDay())
			console.log(obtained_epoch.getMonth() === current_epoch.getMonth(), obtained_epoch.getMonth(), current_epoch.getMonth())
			console.log(obtained_epoch.getFullYear() === current_epoch.getFullYear(), obtained_epoch.getFullYear(), current_epoch.getFullYear())
			*/

			// Check if same date as today.
			if (obtained_epoch.getDay() === current_epoch.getDay() && obtained_epoch.getMonth() == current_epoch.getMonth() && obtained_epoch.getFullYear() == current_epoch.getFullYear()){
				console.log("Data is still valid no need to call API again.")
				return full_obj;
			}
		}
		// Data is invalid or no data field value, obtain new object.


		const data = await getFullData(qry);
		full_obj = createFullObject(location[0], data)


		// Insert it into the database.
		const success = await db.collection('weatherapp').findOneAndUpdate({"id":id}, {"$set": {"weather.full": full_obj}});
		// console.log("Added entry to mongodb.", full_obj);


		// Send this new data to user.
		return full_obj
	}else{
		return null;
	}
}

async function getFullData(query_string){
	const key = process.env.WEATHER_API_KEY1;
	const url = `https://api.weatherapi.com/v1/forecast.json?key=${key}&q=${query_string}&days=7`
	const response = await axios.get(url);
	// console.log("API object", response.data);
	return response.data; // JSON Format.
}


function createFullObject(location, data){
	// This will be quite hard to implement, as its a complex object.
	let forecast_full = data["forecast"]["forecastday"];
	let id = location["id"]

	let full = {
		"id": id,
		"week_data": [  // Max 3 days for weather.
			getFullDayObject(id, forecast_full[0]),
			getFullDayObject(id, forecast_full[1]),
			getFullDayObject(id, forecast_full[2])]
	}
	return full;
}




function getFullDayObject(id, data){
	// In charge of making full preview object.
	let full_day_obj = {
		"id": id,
		"date": String(data["date"]),
		"date_epoch": String(data["date_epoch"]),
		"maxtemp_c": String(data["day"]["maxtemp_c"]),
		"maxtemp_f": String(data["day"]["maxtemp_f"]),
		"mintemp_c": String(data["day"]["mintemp_c"]),
		"mintemp_f": String(data["day"]["mintemp_f"]),
		"avgtemp_f": String(data["day"]["avgtemp_f"]),
		"maxwind_mph": String(data["day"]["maxwind_mph"]),
		"maxwind_kph": String(data["day"]["maxwind_kph"]),
		"totalprecip_mm": String(data["day"]["totalprecip_mm"]),
		"totalprecip_in": String(data["day"]["totalprecip_in"]),
		"avgvis_km": String(data["day"]["avgvis_km"]),
		"avgvis_miles": String(data["day"]["avgvis_miles"]),
		"avghumidity" : String(data["day"]["avghumidity"]),
		"daily_will_it_rain": String(data["day"]["daily_will_it_rain"]),
		"daily_chance_of_rain": String(data["day"]["daily_chance_of_rain"]),
		"daily_will_it_snow": String(data["day"]["daily_will_it_snow"]),
		"daily_chance_of_snow": String(data["day"]["daily_chance_of_snow"]),
		"sunrise_time": String(data["astro"]["sunrise"]),
		"sunset_time": String(data["astro"]["sunset"]),
		"moonrise_time": String(data["astro"]["moonrise"]),
		"moonset_time": String(data["astro"]["moonset"]),
		"moon_phase": String(data["astro"]["moon_phase"]),
		"moon_illumination": String(data["astro"]["moon_illumination"]),
		"status_code": String(data["day"]["condition"]["code"]),
		"hour_data": [
			getHourObject(id, data["hour"][0]),
			getHourObject(id, data["hour"][1]),
			getHourObject(id, data["hour"][2]),
			getHourObject(id, data["hour"][3]),
			getHourObject(id, data["hour"][4]),
			getHourObject(id, data["hour"][5]),
			getHourObject(id, data["hour"][6]),
			getHourObject(id, data["hour"][7]),
			getHourObject(id, data["hour"][8]),
			getHourObject(id, data["hour"][9]),
			getHourObject(id, data["hour"][10]),
			getHourObject(id, data["hour"][11]),
			getHourObject(id, data["hour"][12]),
			getHourObject(id, data["hour"][13]),
			getHourObject(id, data["hour"][14]),
			getHourObject(id, data["hour"][15]),
			getHourObject(id, data["hour"][16]),
			getHourObject(id, data["hour"][17]),
			getHourObject(id, data["hour"][18]),
			getHourObject(id, data["hour"][19]),
			getHourObject(id, data["hour"][20]),
			getHourObject(id, data["hour"][21]),
			getHourObject(id, data["hour"][22]),
			getHourObject(id, data["hour"][23])]
	}
	return full_day_obj;
}

function getHourObject(id, data){
	let hour_obj = {
		"id": id,
		"time": String(data["time"]),
		"time_epoch": String(data["time_epoch"]),
		"temp_c": String(data["temp_c"]),
		"temp_f": String(data["temp_f"]),
		"is_day": String(data["is_day"]),
		"wind_mph": String(data["wind_mph"]),
		"wind_kph": String(data["wind_kph"]),
		"wind_degree": String(data["wind_degree"]),
		"wind_dir": String(data["wind_dir"]),
		"pressure_mb": String(data["pressure_mb"]),
		"pressure_in": String(data["pressure_in"]),
		"precip_mm": String(data["precip_mm"]),
		"precip_in": String(data["precip_in"]),
		"humidity": String(data["humidity"]),
		"cloud": String(data["cloud"]),
		"feelslike_c": String(data["feelslike_c"]),
		"feelslike_f": String(data["feelslike_f"]),
		"windchill_c": String(data["windchill_c"]),
		"windchill_f": String(data["windchill_f"]),
		"heatindex_c": String(data["heatindex_c"]),
		"heatindex_f": String(data["heatindex_f"]),
		"dewpoint_c":  String(data["dewpoint_c"]),
		"dewpoint_f": String(data["dewpoint_f"]),
		"will_it_rain": String(data["will_it_rain"]),
		"chance_of_rain": String(data["chance_of_rain"]),
		"will_it_snow": String(data["will_it_snow"]),
		"chance_of_snow": String(data["chance_of_snow"]),
		"vis_km": String(data["vis_km"]),
		"vis_miles": String(data["vis_miles"]),
		"gust_mph": String(data["gust_mph"]),
		"gust_kph": String(data["gust_kph"]),
		"uv": String(data["uv"])
	}
	return hour_obj;
}



async function preview(_, { id }){
	// Obtains real time data.
	const db = getDb();
	validate(id);
	// Check if preview object has an entry and is valid.
	const location = await db.collection('weatherapp').find({'id': id}).toArray();
	if (location !== undefined){
		const _id = location[0]["_id"];
		const preview = location[0]["preview"];
		const qry = `${location[0]["location"]["region"]},${location[0]["location"]["country"]}`;
		// Check if preview object is empty.
		// console.log("Preview is empty?", (preview));
		if (preview !== undefined){
			// Not empty. check last_updated_epoch entry.
			const current_epoch = new Date().getTime();
			if (parseInt(String(current_epoch).substring(0,10)) - parseInt(preview["last_updated_epoch"]) < 60){
				// Just return the preview object to user.
				return preview;
			}
		}
		// if current and last updated has a time delta of more than 60000ms. [1 min] or preview object is empty.
		const data = await getPreviewData(qry);
		const preview_obj = createPreviewObject(location[0], data);

		// Update entry to mongodb.
		// Deprecated method.
		// const success = await db.collection('weatherapp').findAndModify({query:{"id":1}, update: {"$set": {"weather.preview": preview_obj}}});

		// New method.
		const success = await db.collection('weatherapp').findOneAndUpdate({"id":id}, {"$set": {"weather.preview": preview_obj}});

		// console.log("Added entry to mongodb.", preview_obj)
		return preview_obj;

	}
	else{
		// Preview object is empty and so needs to be updated.
		return null;
	}
}



async function getPreviewData(query_string){
	// In charge of obtaining the update preview data for weather location object via API.
	const key = process.env.WEATHER_API_KEY1;
	const url = `https://api.weatherapi.com/v1/forecast.json?key=${key}&q=${query_string}`
	const response = await axios.get(url);
	// console.log("API object", response.data);
	return response.data; // JSON Format.
}



function createPreviewObject(location, data){

	const weather_code_hashtags = {
		// Dervied hashtags from https://www.weatherapi.com/docs/weather_conditions.json.
		1000: ["#Sunny", "#Clear", "#Calm"],
		1003: ["#Cloudy", "#Decent", "#GoOut"],
		1006: ["#Cloudy", "#NoSun", "#Maybe"],
		1009: ["Overcast", "#Moody", "#Chill"],
		1030: ["Mist", "#Frosty", "#Crispy"],
		1063: ["#Patchy", "#Rain", "#Hopeful"],
		1066: ["#Patchy", "#Snow", "#Chilly?"],
		1069: ["#Patchy", "#Sleet", "#Slippery"],
		1072: ["#Patchy", "#Freezing", "#Drizzle"],
		1087: ["#Thunder", "#Outbreaks", "#Indoors"],
		1114: ["#BlowySnowy", "#Xmas", "#Wintery"],
		1117: ["#Blizzard", "#Lockdown", "#Chilly"],
		1135: ["#Foggy", "#Cloudy", "#Blind"],
		1147: ["#Freezing", "#Foggy", "#Blind"],
		1150: ["#Patchy", "#LightDrizzle", "#Standard"],
		1153: ["#LightDrizzle", "#Refreshing", "#Active"],
		1168: ["#Freezing", "Drizzle", "#Brrrrr"],
		1171: ["#Freezing", "#Heavy", "#Drizzle"],
		1180: ["#Patchy", "#Light", "#Rain"],
		1183: ["#Light", "#Rain", "#Ok.."],
		1186: ["#Moderate", "#Rain", "#Random"],
		1189: ["#Moderate", "#Rain", "#Constant"],
		1192: ["#Heavy", "#Rain", "#Random"],
		1195: ["#Heavy", "#Rain", "#Constant"],
		1198: ["#Light", "#Freezing", "#Rain"],
		1201: ["#Moderate", "#Freezing", "#Rain"],
		1204: ["#Light", "#Sleet", "#Drifty"],
		1207: ["#Moderate", "#Heavy", "#Sleet"],
		1210: ["#Patchy", "#Light", "#Snow"],
		1213: ["#Light", "#Snow", "#Snowman?"],
		1216: ["#Patchy", "#Moderate", "#Snow"],
		1219: ["#Moderate", "#Snow", "#Holiday"],
		1222: ["#Patchy", "#Heavy", "#Snow"],
		1225: ["#Heavy", "#Snow", "#Cancelled"],
		1237: ["#Danger", "#Ice", "#Pellets"],
		1240: ["#Light", "#Rain", "Shower"],
		1243: ["#Moderate", "#RainShower", "#Heavy"],
		1246: ["#Torrential", "#Rain", "#Shower"],
		1249: ["#Light", "#Sleet", "#Shower"],
		1252: ["#Moderate", "#SleetShower", "#Heavy"],
		1255: ["#Light", "#Snow", "#Showers"],
		1258: ["#Moderate", "#Heavy", "#SnowShowers"],
		1261: ["#Light", "#Shower", "#IcePellets"],
		1264: ["#Moderate", "#Shower", "#IcePellets"],
		1273: ["#Patchy", "#Light", "#RainThunder"],
		1276: ["#Moderate", "#Heavy", "#RainThunder"],
		1279: ["#Patchy", "#Light", "#SnowThunder"],
		1282: ["#Moderate", "#Heavy", "#SnowThunder"]
	}

	var preview = {
		"id": location["id"],
		"location_city": location["location"]["region"],
		"location_country": location["location"]["country"],
		"last_updated_epoch": String(data["current"]["last_updated_epoch"]),
		"last_updated": data["current"]["last_updated"],
		"temp_c": String(data["current"]["temp_c"]),
		"temp_f": String(data["current"]["temp_f"]),
		"is_day": data["current"]["is_day"],
		"wind_mph": String(data["current"]["wind_mph"]),
		"wind_kph": String(data["current"]["wind_kph"]),
		"wind_degree": String(data["current"]["wind_degree"]),
		"wind_dir": String(data["current"]["wind_dir"]),
		"pressure_mb": String(data["current"]["pressure_mb"]),
		"pressure_in": String(data["current"]["pressure_in"]),
		"rain_chance": data["forecast"]["forecastday"][0]["day"]["daily_chance_of_rain"],
		"daily_will_it_rain": data["forecast"]["forecastday"][0]["day"]["daily_will_it_rain"],
		"snow_chance": data["forecast"]["forecastday"][0]["day"]["daily_chance_of_snow"],
		"daily_will_it_snow": data["forecast"]["forecastday"][0]["day"]["daily_will_it_snow"],
		"hashtag_desc": weather_code_hashtags[data["forecast"]["forecastday"][0]["day"]["condition"]["code"]],
		"emoji_desc": "No emoji description implemented yet."
	}
	return preview;
}

function get_emoji_status(data){
	const emoji_status = {
		1000 : "",
		1001 : "",
		1002 : "",
		1003 : "",
		1004 : "",
		1005 : ""
	}
}


function validate(value){
	// Input sanitisation.
}



module.exports = {
	preview,
	full
}
