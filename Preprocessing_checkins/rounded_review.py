#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Wed Jul  8 18:25:55 2020

@author: sharadhi
"""

import json 
import csv 

csv_filepath = '/Users/sharadhi/Documents/Summer_semester/Data_Visualization/Group_project/yelp_dataset/new_reviews.csv'

new_csv_file = '/Users/sharadhi/Documents/Summer_semester/Data_Visualization/Group_project/yelp_dataset/rounded_reviews.csv'

line_count = 0 
b_id = []
review = []

with open( csv_filepath ) as csv_file:
    
    csv_reader = csv.reader( csv_file , delimiter = ',' )
    
    for row in csv_reader:
        
        if line_count == 0:
            
            line_count += 1
            
        else:
            
            b_id.append( row[ 0 ] )
            
            review.append( round( float( row[ 1 ] ) , 2 ) )
            
with open( new_csv_file , 'w' ) as csvfile:
    
    csvwriter = csv.writer( csvfile )
    
    csvwriter.writerow( [ 'Business_Id' , 'Average Review' ] )
    
for i in range( 0 , len( b_id ) ):
    
    with open( new_csv_file , 'a+' , newline = '' ) as csvfile:
                
        csvwriter = csv.writer( csvfile )
            
        csvwriter.writerow( [ b_id[ i ] , review[ i ] ] )
    
 