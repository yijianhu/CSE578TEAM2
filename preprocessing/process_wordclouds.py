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


bag_of_words = load_pkl('../yelp_dataset/bag_of_words_model_az.pkl')

top_words = {}

for county in bag_of_words:
    # if len(bag_of_words[county]["positive"]) > 0 and len(bag_of_words[county]["negative"]) > 0:
	top_words[county] = {}

	positive = bag_of_words[county]["positive"]
	positive_df = pd.DataFrame.from_dict(positive, orient='index', columns=['count'])
	top_words[county]["positive"] = positive_df.nlargest(50, 'count')

	negative = bag_of_words[county]["negative"]
	negative_df = pd.DataFrame.from_dict(negative, orient='index', columns=['count'])
	top_words[county]["negative"] = negative_df.nlargest(50, 'count')
    # else:
    #     print("!! EMPTY !!")

print(top_words)




