# ecs522u - GUI
GUI Group Project

## Set Up

In `ui` and `api` folder run `npm install` or `yarn install`

## Run

Start by running the server. In the `api` folder run the CLI command `npm run dev`. (PORT = 3000) </br>
To launch the app, use `yarn start` (will launch on port 8000). </br>
IMPORTANT: To start the app do NOT use `npm start` as it will break! You may choose to use `npm set PORT=8000 && react-scripts start` if you wish to use `npm` commands.

---------

1) Make initial designs and iterate through design.
![image](https://media.github.research.its.qmul.ac.uk/user/2875/files/209ec47d-9998-4c76-bc4a-f802ad88d4c8)

-----------

2) Make Raw Implementation of Design using vanilla HTML and CSS.

![image](https://media.github.research.its.qmul.ac.uk/user/2875/files/c4f068f6-5a86-4905-bcf0-622c2df633f1)
![image](https://media.github.research.its.qmul.ac.uk/user/2875/files/5e78f5d3-ce83-4207-981d-708d5768011f)
![image](https://media.github.research.its.qmul.ac.uk/user/2875/files/aeeaf939-a05c-43d4-a8da-a7678808aa7f)

---------

3) Brainstorm the required data for UI to function in order to start making GraphQL API server.
```
Get Location List with input of lat, long. or string input.

location_list(lat,long || string): [String!]!  String of Supported Location objects.

Location {
	location_city: "London",
	location_country: "UK",
	location_id: "001",
	location_emoji: "💂‍♂️",
	location_lat : "51.509865",
	location_lon:"-0.118092"
}


Get Specific Weather for Location:
get_weather_summary(location_id) gives Weather Object,

Weather {
	temp:"26",
	unit: "C",
	weather_chance: {"rain": 3, "snow":0},
	location_city: "London",
	location_country: "UK",
	location_id: "001",
	location_emoji: "💂‍♂️",
	location_main: "☀️Sunny"
	hashtag_description: ["#Sunny", "Calm", "#Breezy"],
	emote_description: ["☔ Umbrella not needed.", "🩳Shorts recommended"]
	background_icon: "cdn.gui.weatherapp.com/sunny_icon.png",
	date_req: "1646133762"
}

get_weather_detailed(location_id) gives List of Weather Object,
```

----------

4. From this we can derive the main functionalities for our app are:
- [x] Getting preview weather object based on that objects ID.
- [x] Getting a list of supported country objects based on a search || lat,lon (GPS).
- [x] Getting full weather object based on that objects ID.

*I decided to leave authentication and saving weathers to a account because thats passed the scope of the course, instead we just going to add it to cookies, as a preference with an array of IDs of added countries, therefore saving weather country ids in the client rather than having a dedicated database and API for authentication and storing of user data.*

----------
5. Start creating API Server, including the graphql schema required and MongoDB if needed.

Required packages for API Server:

| Package      | Description  |
|--------------|--------------|
| express       | Lightweight web framework, used in combination with middlewares.   |
| apollo-server-express | Used for creating the graphql complaint API server on top of Express.     |
| dotenv | Allows the storage of environment variables that are accessible by the whole project.     |
| fs | Allows accessing filesystem of the hosting machine.     |
| graphql | Requires to allow for graphql api, including data types, and handling of different required functionality.     |
| mongodb | Connection to a mongodb database, through node application.     |
| nodemon | Automatically restarts running of API server when changes are made in development mode.    |
| eslint | Formatting and best practise linting, and error highlighting.  *Not necessary*   |


6. Now that the schema has been established and some signatures for the resolver functions, we now need to implement each function through API, database calls ,processing of data and formatting of data.


------- 
### GraphQL calls
Before we do that though, lets take a look at some of the queries that can be made to our API. 

Accessible through https://studio.apollographql.com/sandbox/explorer or http://localhost:3000/graphql.

**GetPreviewWeather API**

*Get brief weather info for a specific location for today current date.*
```
query GetPreviewWeather($getPreviewWeatherId: Int!) {
  getPreviewWeather(id: $getPreviewWeatherId) {
    id 
    temp_no
    temp_scalar
    rain_chance
    snow_chance
    location_city
    location_country
    hashtag_desc
    weather_date
    emoji_desc
    date_req
  }
}
```

**GetListSupportedCountriesBySearch API**

*Gets List of Supported Countries given a search query by user.*
```
query GetListSupportedCountriesBySearch($query: String) {
  getListSupportedCountriesBySearch(query: $query) {
    id
    location_country
    location_city
  }
}
```

**GetListSupportedCountriesByGPS API**

*Gets List of Supported Countries given the GPS coordinates given.*
```
query GetListSupportedCountriesByGPS($query: GPS!) {
  getListSupportedCountriesByGPS(query: $query) {
    id
    location_country
    location_city
  }
}
```
**GetFullWeather API**

*Gets full weather status for a location for a 7 day period.*
```
query GetFullWeather($getFullWeatherId: Int!) {
  getFullWeather(id: $getFullWeatherId) {
    id
    week_data {
      id
      weatherDate
      weatherStatus
    }
  }
}
```

Restrictions to only involve Capital Cities as the scope of the API will be too large to handle.
------

To test the APIs use the url, http://localhost:3000/graphql. Mention your IP to me so I can add your IP to access list for database.

**Search String API Showcase**
![image](https://media.github.research.its.qmul.ac.uk/user/2875/files/8bf170ca-f577-4a75-8e0c-286fd9b199f8)

**PreviewWeather API Showcase**
![image](https://media.github.research.its.qmul.ac.uk/user/2875/files/0778efc7-5ef6-457d-a51b-caae9df79100)

**Full Weather API Showcase**
![image](https://media.github.research.its.qmul.ac.uk/user/2875/files/25e4d015-8b76-4b4c-8b1a-2e6c6395df70)

**Search GPS API Showcase**
This requires using Google Maps API, which requires card details and we dont want to use it for a weather app.


------
### UI Side
