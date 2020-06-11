
import pandas as pd
import os
from os.path import exists
import pickle
import seaborn as sns
import numpy as np

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


reviews_df = load_pkl('../../yelp_dataset/yelp_academic_dataset_business.pkl')
print(reviews_df.columns)
ax = sns.distplot(reviews_df['stars'])
fig = ax.get_figure()
fig.savefig("business_stars.png")


