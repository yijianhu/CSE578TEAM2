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

IGNORE_CATEGORIES = []

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

# Get data
restaurant_df = load_pkl('../yelp_dataset/yelp_academic_dataset_restaurant.pkl')

word_freq = {}

for index, row in tqdm(restaurant_df.iterrows()):
    # Get the State
    restaurant_state = row['state']
    # Add State key to dictionary if not exists
    if restaurant_state not in word_freq.keys():
        word_freq[restaurant_state] = {}
    # Standardize the text (lowercase, remove punctuation etc.)
    categories_text = row['categories']
    if categories_text:
        categories_text = categories_text.lower()
        # Tokenize the words in the review
        tokens = categories_text.split(",")
        tokens = [w.strip() for w in tokens]
        tokens = [w for w in tokens if not w in IGNORE_CATEGORIES]
        # Separate out positive and negative reviews into different bag-of-words models
        for token in tokens:
            if token not in word_freq[restaurant_state].keys():
                word_freq[restaurant_state][token] = 1
            else:
                word_freq[restaurant_state][token] += 1

save_pkl('../yelp_dataset/categories_model.pkl', word_freq)





