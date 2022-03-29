# Insert mongodb object into mongodb collection.
# Inserting documents into collection.
import pymongo
from pymongo.server_api import ServerApi

db_password = ""


client = pymongo.MongoClient(f"mongodb+srv://maki:{db_password}@cluster0.3tlbi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", server_api=ServerApi('1'))
db = client['maki']
collection = db['weatherapp']




import json
id = 1
# Formatting json objects to insert into mongodb collection.
# Open json file and read into a list. B:\Personal Files\QMUL_NOTES\Planning and Notes\QMULWork\Semester 2 Yr2\Graphic User Interfaces\Coursework\weather-app\api\js_modules\location_obj.json
with open(r'B:\Personal Files\QMUL_NOTES\Planning and Notes\QMULWork\Semester 2 Yr2\Graphic User Interfaces\Coursework\weather-app\api\js_modules\location_obj.json') as json_file:
    json_data = json.load(json_file)
    for location_object in json_data:
        location_object["localtime_epoch"]=""
        location_object["localtime"]=""
        location = {"id": id,
                    "location": location_object,
                    "weather": {
                        "preview": {},
                        "full": {"week_data": []}
                    }}
        print(location)
        id += 1
        collection.insert_one(location)


exit()




