import pandas as pd
import os
from os.path import exists
import pickle

import re

#
# Saves an object to pickle file. If it exists then delete and create a new one.
# If it doesn't then it will create a new one.
#
# @param    path            String
# @param    obj             Object
#
def save_pkl(path, obj):

    if exists(path):
        os.remove(path)

    # Save the object
    pickle.dump(obj, open(path, "wb"))

    #
# Loads the object from the pickle file
#
# @param    path            String
# @return   obj             Object
#
def load_pkl(path):

    obj = None

    # Check if the file exists and contains data
    if exists(path) and os.path.getsize(path) > 0:
        obj = pickle.load(open(path, "rb"))
    else:
        print("Note: " + path + " either doesn't exist or is empty")

    return obj

def get_county(lat, lon):
    locator = Nominatim(user_agent="myGeocoder", timeout=5)
    coordinates = str(lat) + ", " + str(lon)
    location = locator.reverse(coordinates)
    if "county" in location.raw["address"].keys():
        return location.raw["address"]["county"]
    else:
        print(location.raw["address"])
        return None


import pandas as pd
import geopandas as gpd
import geopy
from geopy.geocoders import Nominatim
from geopy.extra.rate_limiter import RateLimiter
import matplotlib.pyplot as plt
import plotly_express as px
import tqdm
from tqdm._tqdm_notebook import tqdm_notebook

businesses_df = load_pkl('../yelp_dataset/yelp_academic_dataset_business.pkl')

# Filter to get only restaurants
restaurants_df = businesses_df[businesses_df['categories'].str.contains("restaurant", flags = re.IGNORECASE) | businesses_df['categories'].str.contains("food", flags = re.IGNORECASE)]
restaurants_df = restaurants_df.loc[restaurants_df['state'] == "AZ"]
# Re-index the dataframe
restaurants_df = restaurants_df.reset_index(drop=True)

restaurants_df['county'] = restaurants_df.apply(lambda x: get_county(x['latitude'],x['longitude']),axis=1)

print(restaurants_df['county'])

# Save as pickle
save_pkl('../yelp_dataset/yelp_academic_dataset_restaurant_az_counties.pkl', restaurants_df)





