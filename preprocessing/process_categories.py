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


bag_of_words = load_pkl('../yelp_dataset/categories_model_zip.pkl')

top_words = []

for zip in bag_of_words:
    print(zip)
    if len(bag_of_words[zip]) > 0:
        # top_words[zip] = {}

        categories_df = pd.DataFrame.from_dict(bag_of_words[zip], orient='index', columns=['count'])
        top_words.append((zip, categories_df.nlargest(1, 'count').index[0]))

    else:
        print("!! EMPTY !!")

top_words_df = pd.DataFrame(top_words, columns=['zip', 'category'])
save_pkl('../yelp_dataset/top_category_zip.pkl', top_words_df)
print(top_words_df)





