#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Wed Jul  8 20:51:57 2020

@author: sharadhi
"""

import json 
import csv

final_review = {'NC': [('3C0bnFhjkgYP9mWORKg6cA', '4.94'), ('Cu5oU2dO3JCEQ4XHK0CfbQ', '4.93'), ('XBfvbNHOji_fRyhzO-KuEw', '4.92')], 'AZ': [('jikjjW1bN0swCMguFazcxg', '4.97'), ('_GdzDB3SU9Ni7mAOQehIXQ', '4.96'), ('MueAEUT6iqRyOvuIZ5Ixaw', '4.96')], 'QC': [('hbAZFzXzv-5WB-zEcln-kA', '4.86'), ('HqIKlhg6OKhpBfEvMwSIwA', '4.85'), ('uDB4rq3G_OthZNjG-IEwPQ', '4.84')], 'NV': [('v6dqe7U2MVtaWyHbvtw_tw', '4.98'), ('URw54F4_FuxU8MR8T_bxpg', '4.98'), ('TcSGXZhrdJi-1mtwV0POTQ', '4.97')], 'IL': [('Lwb6bG1Qu3BbW7FJj5suLw', '4.9'), ('1bgcPZXnzAZvrc6HcBfc7A', '4.79'), ('4hWDMVtfnpyY72_5QMbthA', '4.77')], 'ON': [('as-VRXsqpDMWYtWWdSyu2w', '4.91'), ('_4B99coJlSasAgQPm0gyqA', '4.88'), ('PfT-Sws-1bHnzLkp7AedmA', '4.88')], 'AB': [('GJrHBdCpTDkAizvLdVfgpw', '4.88'), ('8afnw00slGAh_bsSnkFqGA', '4.8'), ('xxOHJFjVsrhMsJxtbCq2Dw', '4.79')], 'PA': [('0OkfU0vDBprsIEd5hWuhAQ', '4.91'), ('DtLDAFVH8OyywUw23y86xA', '4.88'), ('6G3t042U69yzZ99_yvY3_A', '4.88')], 'WI': [('4ovtrDTXvLK5dDdD09Ecug', '4.88'), ('8pPD7BhiPAq-SC4vSBns1w', '4.85'), ('Vi7DWovv_vnWmxhURiioFw', '4.85')], 'SC': [('0aMrF0FaZNGN7zVGx81lDA', '4.88'), ('zd1fJLPz0ZeV4aoSIsRYcg', '4.81'), ('WokSBO9j1o1iWxlnD4-gIA', '4.8')], 'OH': [('n83pt3IT2GqJ-OXaabL11w', '4.92'), ('pYad8gX0DTOGFDcF5p8dxw', '4.86'), ('mXaqyzYTqiTc-LrTFAm0Yw', '4.85')], 'CA': [('HkoAZYwCVj8R9EGz4aywxg', '4.76'), ('UE_fvET7Aj16w7Cluj7ZGg', '4.67'), ('G2ED4IsQKR7nMhUQZOxLmA', '4.56')], 'TX': [('zZ3XzaG82sL4OU90Mpp60w', '4.56'), ('7j5yndEexyQn9cpVXLIIpw', '4.18'), ('2H9lfg6In0Z5bFi0hbWOIg', '3.26')], 'NY': [('jH19V2I9fIslnNhDzPmdkA', '4.58'), ('f5Pg89x-2xek78E9KHMhNg', '4.29'), ('6ipr7nnwrzf_o3MGD-8nlA', '4.21')], 'CO': [('Y-omMxOCDSYd7jbo1PSCig', '2.14'), ('D2RoOb4UkH2azf8DgvNfUA', '2.57')], 'XWY': [('FByZsT1Sob5Vf1AYJFPxPg', '4')], 'GA': [('3de3H2nR8RN2TKSJi-vVuQ', '4.2'), ('iuaF3WLy4ED12iiJ0GADJg', '2.6'), ('Gr4bB2OfHE6OYX48HcaxVw', '1.36')], 'BC': [('8uinWc830J3RYgKlshd1Jw', '2'), ('72GGspuzlRC4hhIgy-IFAw', '2')], 'YT': [('Cpb-Kpkg9qmHzzTC75ZPuA', '2.6')], 'HPL': [('x5sx84Fa1cpnLwvXGtsJEw', '3.8')], 'AL': [('sbtxQN1-pxyfNr_aVYew9Q', '4.43'), ('6NAWNCgdLHeMh3wHRgu6vw', '2.75'), ('sSlMkHBYFOMYbrYG5Jg0Bw', '3.5')], 'UT': [('Z1Lq5llLEbtkW54JRr7sJw', '2.62'), ('yYpeC2dEg0PLSVjzxoIyLQ', '3.67')], 'VT': [('_WbkQha0xqf2DnYumHAaqg', '2.86'), ('tJRDll5yqpZwehenzE2cSg', '4.43')], 'WA': [('DHZrZYmh5h7GrgQDl5LwtQ', '4.5'), ('GIqiqpvaSLLKVGbp5cmFkA', '3.2'), ('SqWeTQqHL--uksgVcpw_Xw', '2.4')], 'NE': [('NJgEanFCcBPxY5eKyEf2Lg', '3.67'), ('8ELdE4e05KUeB10ceSQk3A', '1.55')], 'DOW': [('U9uyfhpZ89VEH5_webJ5Xg', '3.17')], 'MI': [('1UvD251wzNWGpECX1uQmBA', '3.4'), ('KcuyNq-M2lPmFkhyPk4uAQ', '3.5')], 'FL': [('Zn3GV2xa9a-8bHjUM-2sow', '1.92'), ('Od_A8uuN2cc7hWF8Oj1PqQ', '4.4'), ('a4_VdKv3O1Ug6TEHRpgocw', '2.33')], 'AR': [('pyOHNzoMBJjZyihZPWYtFA', '3.45')], 'HI': [('jSoXCOgEZ97KSaMsbiJdPg', '1.98')], 'MB': [('MgnC3c3IByQkOJ0vyBKfUA', '3.76')], 'OR': [('pp7XScHhSmEHc5k2EsLLcw', '2.45')], 'AK': [('WwwYZakdSQM9174gdZdUIA', '2.6')], 'VA': [('e4PCkJENurMOxuXd9ZMMPA', '1.76')], 'CT': [('Q75WJODIMDC7Y8XRYLDbtQ', '3.42'), ('6kSvyueHgjLragjJWoAaJg', '4.33')], 'MO': [('3y6ZjuRmK1Jh6_VwBh8VDQ', '2.71')], 'DUR': [('svMJjPd4l_Zb_MoxejYZvw', '2.6')]}

#checkin_filepath = '/Users/sharadhi/Documents/Summer_semester/Data_Visualization/Group_project/yelp_dataset/checkin.json'

business_filepath = '/Users/sharadhi/Documents/Summer_semester/Data_Visualization/Group_project/yelp_dataset/business.json'

csv_file = '/Users/sharadhi/Documents/Summer_semester/Data_Visualization/Group_project/yelp_dataset/top_three.csv'

with open( csv_file , 'w' ) as csvfile:
    
    csvwriter = csv.writer( csvfile )
    
    csvwriter.writerow( [ 'State' , 'City' , 'Business Name' , 'Business Id' , 'Stars' ] )

business_data = []
        
with open( business_filepath ) as f:
    
    for line in f:
        
        business_data.append( json.loads( line ) )

for key in final_review:
    
    print( key )
    
    lst = final_review[ key ]
    
    for item in lst:
        
        row = []
        
        row.append( key )
        
        for line in business_data:
            
            if( line[ 'business_id' ] == item[ 0 ] ):
                
                row.append( line[ 'city' ] )
                
                row.append( line[ 'name' ] )
                
                row.append( item[ 0 ] )
                
                row.append( item[ 1 ] )

                break 
            
        with open( csv_file , 'a+' , newline = '' ) as csvfile:
                
            csvwriter = csv.writer( csvfile )
            
            csvwriter.writerow( row )
            
        
        
    
    