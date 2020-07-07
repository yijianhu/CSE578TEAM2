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

businesses_df = load_pkl('../yelp_dataset/yelp_academic_dataset_business.pkl')

# Filter to get only restaurants
restaurants_df = businesses_df[businesses_df['categories'].str.contains("restaurant", flags = re.IGNORECASE) | businesses_df['categories'].str.contains("food", flags = re.IGNORECASE)]
# Re-index the dataframe
restaurants_df = restaurants_df.reset_index(drop=True)
# Save as pickle
save_pkl('../yelp_dataset/yelp_academic_dataset_restaurant.pkl', restaurants_df)





