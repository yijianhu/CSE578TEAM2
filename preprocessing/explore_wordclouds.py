import pandas as pd
import os
from os.path import exists
import pickle
import seaborn as sns
import numpy as np
from datetime import datetime
from datetime import date

import nltk
nltk.download('punkt')
nltk.download('stopwords')
import random  
import string

import bs4 as bs  
import urllib.request  
import re 

from tqdm import tqdm

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
reviews_df = load_pkl('../yelp_dataset/yelp_academic_dataset_review.pkl')
restaurant_df = load_pkl('../yelp_dataset/yelp_academic_dataset_restaurant_usa.pkl')
# Get just the counties
restaurant_counties_df = restaurant_df[['business_id', 'postal_code']]
# Inner Join the two dataframes
combined_df = reviews_df.set_index('business_id').join(restaurant_counties_df.set_index('business_id'), how="inner")

word_freq = {}
# Get stop words
stop_words = set(nltk.corpus.stopwords.words('english'))

for index, row in tqdm(combined_df.iterrows()):
    # Get the zip
    restaurant_zip = row['postal_code']
    # Add zip key to dictionary if not exists
    if restaurant_zip not in word_freq.keys():
        word_freq[restaurant_zip] = {}
        word_freq[restaurant_zip]["positive"] = {}
        word_freq[restaurant_zip]["negative"] = {}
    # Standardize the text (lowercase, remove punctuation etc.)
    review_text = row['text']
    if review_text:
        review_text = review_text.lower()
        review_text = re.sub(r'\W',' ',review_text)
        review_text = re.sub(r'\s+',' ',review_text)
        # Tokenize the words in the review
        tokens = nltk.word_tokenize(review_text)
        # Remove stop words (the, for, and, i etc.)
        tokens = [w for w in tokens if not w in stop_words]
        # Separate out positive and negative reviews into different bag-of-words models
        if row['stars'] > 3:
            for token in tokens:
                if token not in word_freq[restaurant_zip]["positive"].keys():
                    word_freq[restaurant_zip]["positive"][token] = 1
                else:
                    word_freq[restaurant_zip]["positive"][token] += 1
        elif row['stars'] < 3:
            for token in tokens:
                if token not in word_freq[restaurant_zip]["negative"].keys():
                    word_freq[restaurant_zip]["negative"][token] = 1
                else:
                    word_freq[restaurant_zip]["negative"][token] += 1

save_pkl('../yelp_dataset/bag_of_words_model_zip.pkl', word_freq)





