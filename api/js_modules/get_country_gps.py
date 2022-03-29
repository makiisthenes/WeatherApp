# Option for getting city and country from coordinates.

import reverse_geocoder as rg
import sys


if len(sys.argv) != 3:
	# print("Incorrect number of arguments")
	exit()

lat, lon = sys.argv[1:]
result = rg.search((lat,lon))
if result:
	print(result[0])