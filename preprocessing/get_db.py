import pandas as pd
import os
from os.path import exists
import pickle
import seaborn as sns
import numpy as np
from datetime import datetime
from datetime import date
import random  
import string

import bs4 as bs  
import urllib.request  
import re 

from tqdm import tqdm
import heapq
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


# bag_of_words = load_pkl('../yelp_dataset/categories_model.pkl')

# top_words = {}

# for state in bag_of_words:
#     print(state)
#     # if len(bag_of_words[state]["positive"]) > 0 and len(bag_of_words[state]["negative"]) > 0:
# 	# top_words[state] = {}

# 	# categories_df = pd.DataFrame.from_dict(bag_of_words[state], orient='index', columns=['count'])
# 	# top_words[state] = categories_df.nlargest(10, 'count')

#     # else:
#     #     print("!! EMPTY !!")

# print(top_words)

from sqlalchemy import create_engine

x = load_pkl("../yelp_dataset/yelp_academic_dataset_business.pkl")

y = x[["business_id", "name", "city", "state", "postal_code"]]

engine = create_engine('sqlite:///yelp_academic_dataset_business.db', echo=True)
sqlite_connection = engine.connect()

sqlite_table = "Businesses"
y.to_sql(sqlite_table, sqlite_connection, if_exists='fail')

sqlite_connection.close()

# y = x.loc[x["state"] == "MO"]

# print(y)




