import React, {useContext, useMemo, useState} from 'react';
import {Box} from "./weather_box";
import arrow from '../images/back_arrow.svg'

import '../css/add_menu.css';
import '../css/bot_bar.css';

import {searchCity, getWeatherForCityId} from "../client";

const WeatherContext = React.createContext({
    // Context to pass
    weather: null,
    setWeather: () => {}
})
export function useWeather(){
    // Function to remotly access context hooks
    return useContext(WeatherContext);
}

function Add(props){
    // Add Component to add new Weathers Locations to the main screen
    const [add, setAdd] = useState("Add")

    function change(){
        setAdd('Added')
    }

    for (let i = 0; i < props.wtr.length; i++){
        if (props.loc[0] === props.wtr[i].props.id){
            return (
                <div className='main_button add_location_container'>
                    <span>{props.loc[1]}, {props.loc[2]}</span>
                    <button disabled>Added</button>
                </div>
            )
        }
    }

    return (
        <div className='main_button add_location_container'>
            <span>{props.loc[1]}, {props.loc[2]}</span>
            <button onClick={() => {
                props.fun(props.loc[0]);
				props.save(props.loc[0]);
                change();
            }}>{add}</button>
        </div>
    )
}

export function Main() {
    // Main Screen
    const [menu, setMenu] = useState(false);
    const [locations, setLocations] = useState(null);
    const [weather, setWeather] = useState([]);
	const [loading, setLoading] = useState(false);
	const [checkLocal, setLocal] = useState(false);
    const value = useMemo(
        () => ({weather, setWeather}),
        [weather]
    );
    let menu_out, weather_out;

    async function get_locations(e){
        // Function to get locations
        if (e.target.value.length >= 3){
            let cities = await searchCity(e.target.value);
            if (cities) {
                let out = [];
                for (let i = 0; i < cities.getListSupportedCountriesBySearch.length; i++) {
                    out.push([
                        cities.getListSupportedCountriesBySearch[i].id,
                        cities.getListSupportedCountriesBySearch[i].location_name,
                        cities.getListSupportedCountriesBySearch[i].location_country
                    ]);
                }
                setLocations(out);
            }
        }
    }
	
	function checkWeatherEmpty(){
		// Checking to see if weather list is empty so loading can be switched off.
		let savedList = JSON.parse(localStorage.getItem("savedLocation"));
		if (savedList === null || savedList.length === 0){
			setLoading(false);
		}
	}
	
    async function get_weather_for_location(id, cache=false){
        // Function to get weather for given location
        try{
            let wtr = weather
            if (!wtr || wtr.length === 0){
                wtr = []
            }
            let weather_api = await getWeatherForCityId(id);
            let city = weather_api.getPreviewWeather.location_city;
            let country = weather_api.getPreviewWeather.location_country;
            let temp_c = weather_api.getPreviewWeather.temp_c;
            let rain = weather_api.getPreviewWeather.rain_chance;
            let hashtag = weather_api.getPreviewWeather.hashtag_desc;
            let will_rain = weather_api.getPreviewWeather.daily_will_it_rain;
			const weather_box = <Box
                id={id}
                city={city}
                country={country}
                temp_c={temp_c}
                rain={rain}
                will_rain={will_rain}
                hashtag={hashtag} 
				checkWeatherEmpty={checkWeatherEmpty}
			/>;
					 
			if (cache === false){
				wtr.push( weather_box );
            	setWeather(wtr);
			}else{
			return weather_box
			}
        }catch (e){
            console.log(e)
            setWeather([]);
        }
    }

	function back(){
		// Function for button to switch between menu and main screen
		setMenu(!menu);
		setLocations(null);
	}

	function add_weather_local_storage(id){
		// First check whether id is already in localStorage, even-though there is a mechanism, we want to make sure it works without error.
		// Make sure id is an int.
		let add_id;
		if (Number.isInteger(id)){
			add_id = id;
		}else{
			add_id = parseInt(id);
		}
		
		// Obtain the savedList of ids from localStorage.
		let savedList = JSON.parse(localStorage.getItem("savedLocation"));
		
		if (savedList === null){
			localStorage.setItem("savedLocation", JSON.stringify([]));
			savedList = [];
		}

		if (savedList.includes(add_id)){
            // Check if the id is in the savedList of ids.
			console.log("Error, this listing shouldn't be able to be added. Error #1")
		}else{
			// Push id into savedList and set the localStorage item.
			savedList.push(add_id);
			localStorage.setItem("savedLocation", JSON.stringify(savedList));
			console.log("ID has been saved in localStorage.", savedList);
		}
	}
	
	async function check_local_storage(){
		// Check if user has any saved locations in local storage;
        setLocal(true);
        if (loading === false){
            setLoading(true)
        }
        let savedList = JSON.parse(localStorage.getItem("savedLocation"));
        if (savedList !== null && savedList.length > 0){
            // Obtain all ids for this and present them.
            let saved_weather_boxs = [];
            for (let i = 0; i < savedList.length; i++){
                // Using the service function, it is saved in weather state.
                let weather_box = await get_weather_for_location(parseInt(savedList[i]), true);
                saved_weather_boxs.push(weather_box);
            }
            setWeather(saved_weather_boxs);
            setLoading(false);
            return true;
        }else{
            setLoading(false);
            return false;
        }
	}

    // Used to display locations in the add menu
	if (!locations && menu) {
		menu_out = <div className='main_button add_location_container'>
			<span>Start typing to search</span>
		</div>;
	}else if (menu){
		let print = [];
		for (let i = 0; i < locations.length; i++){
			let out = <Add loc={locations[i]} save={add_weather_local_storage} fun={get_weather_for_location} wtr={weather}/>;
			print.push(out);
		}
		menu_out = <div>{print}</div>;
	}
	
	//Used to display weather info
	if (weather.length > 0){
		weather_out = weather;
	}else{
		let saved_weather = false;
		if (!checkLocal){
            // First render only.
            saved_weather = check_local_storage();
		}
		if (saved_weather !== false){
			if (weather.length > 0){
				weather_out = weather;
			}else{
				weather_out = <div id="add_empty">{loading ? "Loading..." :"Add weather to get started"}</div>;
			}
		}else{
			weather_out = <div id="add_empty">{loading ? "Loading..." :"Add weather to get started"}</div>;
		}
	}

	// Menu Ui
	if (menu){
		return(
			<section id="MainContent">
				<button className="black_bg back_button"
						onClick={back} >
					<img src={arrow} alt="back" />
					<span className="back_font main_font white_fg">Back</span>
				</button>
				<div id="search_input">
					<input type="text" placeholder="Search for a place to add..." onChange={get_locations}/>
				</div>
				{menu_out}
			</section>
		)
	}

	// Main Ui
	return(
		<React.StrictMode>
			<section id="MainContent">
				<div id="main_content_container">
					<WeatherContext.Provider value={value}>
						{weather_out}
					</WeatherContext.Provider>
				</div>
			</section>
			<section id="BottomBar">
				<div id="bottom_bar_container" className="flex_parent flex_vcenter flex_hcenter">
					<button
						className="main_button"
						onClick={back}>
						<h2>Add Weather</h2>
					</button>
				</div>
			</section>
		</React.StrictMode>
	)
}
