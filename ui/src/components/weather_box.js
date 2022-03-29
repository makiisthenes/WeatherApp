import React, { useState, useEffect } from "react";
import bin from "../images/bin.svg"
import { useWeather } from "./main";
import { getWeatherRefreshForCityId } from "../client";


export function Box(props) {
    // Box which contains weather information for given location
    const {weather, setWeather} = useWeather();

	// States for WeatherBox component.
	const id = props.id;
	const city = props.city;
	const country = props.country;
	const [temp_c, setTemp] = useState(props.temp_c);
	const [rain, setRain] = useState(props.rain) 
	const [will_rain, setWillRain] = useState(()=>{
		return (props.will_rain === 1 ? "" : "not ");
	});
	const [hash, setHash] = useState(()=>{
		let hash_arr = [];
    	for (let i = 0; i < props.hashtag.length; i++){
        	hash_arr.push(<span>{props.hashtag[i]}</span>)
    	}
		return hash_arr;
	});

	useEffect(() => {
  		// This will fire only on mount.
		const interval = setInterval(async () => {
			// Run refresh weather function once every 60 seconds.
			await refresh_weather();
		}, 60000);
		return () => clearInterval(interval);
		},[])

    function remove(){
        // Function to remove itself if the bin icon is pressed
        try{
            let wtr = [...weather];
            let pos = 0;
            for (let i = 0; i < weather.length; i++){
                if (id === weather[i].props.id){
                    pos = i;
                }
            }
            wtr.splice(pos, 1);
            setWeather(wtr);
        }catch (e){
            setWeather([]);
        }
		props.checkWeatherEmpty();
    }	
	
	function remove_weather_local_storage(id){
		// Checks if the id is already in localStorage and then removes it.
		// Make sure id is an int.
		let remove_id;
		
		if (Number.isInteger(id)){
			remove_id =id;
		}else{
			remove_id =  parseInt(id);
		}
		
		// Obtain the savedList of ids from localStorage.
		let savedList = JSON.parse(localStorage.getItem("savedLocation"));
		
		if (savedList === null){
			localStorage.setItem("savedLocation", JSON.stringify([]));
			savedList = [];
		}

		if (savedList.includes(remove_id)){
			// Remove the selected id from the array.
			savedList.splice(savedList.indexOf(remove_id), 1);
			localStorage.setItem("savedLocation", JSON.stringify(savedList));
		}else{
			console.log("Error, this listing shouldnt be able to be added. Error #1")
		}
	}
	
		
	async function refresh_weather(){
		// Refresh data of the weather_box
		let data = await getWeatherRefreshForCityId(props.id);
		let refresh_temp_c = data.getPreviewWeather.temp_c;
		let refresh_rain_chance = data.getPreviewWeather.rain_chance;
		let refresh_daily_will_it_rain = data.getPreviewWeather.daily_will_it_rain;
		let refresh_hashtag_desc = data.getPreviewWeather.hashtag_desc;
		// let emoji_desc = data.getPreviewWeatherId.emoji_desc;  // Unsupported.

		// For this we need to transform all props given to this object into states.
		let calc_rain = (refresh_daily_will_it_rain === 1 ? "" : "not ")
		
		// Setting states, causing a rerender.
		setTemp(refresh_temp_c);
		setRain(refresh_rain_chance);
		setWillRain(calc_rain);
		let refresh_hash_arr = [];
    	for (let i = 0; i < refresh_hashtag_desc.length; i++){
        	refresh_hash_arr.push(<span>{props.hashtag[i]}</span>)
    	}
		setHash(refresh_hash_arr);
	}

    return (
        <div className="weather_preview_box">
            <div className="bin_wrapper abs right top">
                <a onClick={()=>{
					// Before to remove from localStorage before rerender
					remove_weather_local_storage(id); 
					remove();
				}}><img src={bin} alt='bin'/></a>
            </div>

            <div className="location_wrapper abs right bottom">
                <h2>{city},{country}</h2>
            </div>

            <div className="weather_preview_main_content">
                <div className="weather_preview_temp_container">
                    <span className="main_font">{temp_c}</span>
                    <span className="main_font">&#176;C</span>
                </div>
                <div className="main_font weather_preview_hashtag_container">
                    {hash}
                </div>
                <div className="main_font weather_preview_emoji_statements">
                    <h2 className="weather_preview_emoji_rain_chance">🌧️ {rain}% chance of rain.</h2>
                    <h2 className="weather_preview_emoji_umbrella_req">☔ Umbrella {will_rain}needed.</h2>
                    <h2 className="weather_preview_emoji_clothing_stat">🩳 Emojis not supported yet.</h2>
                </div>
            </div>
        </div>
    )
}