#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Sun Jul  5 11:03:09 2020

@author: sharadhi
"""

import json 
import csv

review_filepath = '/Users/sharadhi/Documents/Summer_semester/Data_Visualization/Group_project/yelp_dataset/review.json'

business_filepath = '/Users/sharadhi/Documents/Summer_semester/Data_Visualization/Group_project/yelp_dataset/business.json'

business_data  = []

with open( business_filepath ) as f:
    
    for line in f:
        
        business_data.append( json.loads( line ) )
        
#print( len( business_data ) )

b_id = []

for i in range( 0 , len( business_data ) ):
    
    b_id.append( business_data[ i ][ 'business_id' ] )
    
print( len( b_id ) )
    
review_data = []

with open( review_filepath ) as f:
    
    for line in f:
        
        review_data.append( json.loads( line ) )
        
review = {}

print(" About to begin ")

for i in range( 0 , len( review_data ) ):
    
    if( i % 10000 == 0 ):
        
        print( i )
    
    if( review_data[ i ][ 'business_id' ] not in review ):
        
        review[ review_data[ i ][ 'business_id' ] ] = [ float( review_data[ i ][ 'stars' ] ) , 1 ]
        
    else:
        
        review[ review_data[ i ][ 'business_id' ] ][ 0 ] += float( review_data[ i ][ 'stars' ] )
        review[ review_data[ i ][ 'business_id' ] ][ 1 ] += 1 
        
print( len( review ) )

csv_file = '/Users/sharadhi/Documents/Summer_semester/Data_Visualization/Group_project/yelp_dataset/new_reviews.csv'

with open( csv_file , 'w' ) as csvfile:
    
    csvwriter = csv.writer( csvfile )
    
    csvwriter.writerow( [ 'Business_Id' , 'Average Review' ] )
    
for key in review:
    
    with open( csv_file , 'a+' , newline = '' ) as csvfile:
            
        csvwriter = csv.writer( csvfile )
        
        csvwriter.writerow( [ key ,  ( review[ key ][ 0 ] + 6 )  / ( review[ key ][ 1 ] + 2 )  ] )
        
print( " All done " )
        

        
        
            
            
            
            
        
        
    
