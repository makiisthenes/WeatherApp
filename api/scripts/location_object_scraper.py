import requests, json
api_key = "f252a41a0b8c45aba6a13440221303"

# Open json file at location B:\Personal Files\QMUL_NOTES\Planning and Notes\QMULWork\Semester 2 Yr2\Graphic User Interfaces\Coursework\weather-app\api\js_modules\country-by-alphabet-letters.json
# and read the contents into a variable

with open('B:/Personal Files/QMUL_NOTES/Planning and Notes/QMULWork/Semester 2 Yr2/Graphic User Interfaces/Coursework/weather-app/api/js_modules/country-by-capital-city.json') as f:
    data = f.read()
    # print(data)
    # Convert data into json format
    data = data.replace('\n', '')
    data = data.replace('\r', '')
    data = data.replace('\t', '')
    data = data.replace('\r\n', '')
    data = data.replace(' ', '')
    # print("#"*100, data)
    # Convert json into dictionary
    data = eval(data)


for country in data:
    query = f'{country["city"]},{country["country"]}'
    url = f"http://api.weatherapi.com/v1/current.json?q={query}&key={api_key}"
    response = requests.get(url)
    # Get the response data in dictionary format.
    data = response.json()
    if data:
        try:
            print(data["location"])
        except:
            pass
