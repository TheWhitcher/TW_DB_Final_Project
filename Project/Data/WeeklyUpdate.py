#Import basic data tools
import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
import seaborn as sns

#Create dataframes from the different csv
co2 = 'annual-co2-emissions-per-country.csv'
gdpCapita = 'gdp-per-capita.csv'
methane = 'methane-emissions.csv'
nitrous = 'nitrous-oxide-emissions.csv'
popStat = 'population-and-demography.csv'
ghg = 'total-ghg-emissions.csv'
#new = 'new_csv.csv'

dfCo2 = pd.read_csv(co2)
dfGdp = pd.read_csv(gdpCapita)
dfMet = pd.read_csv(methane)
dfNit = pd.read_csv(nitrous)
dfPop = pd.read_csv(popStat)
dfGhg = pd.read_csv(ghg)
#dfnew = pd.read_csv(new) 

#List of the G20 Countries
#If new country needs to be added do it here
G20 = ['Argentina', 
       'Australia', 
       'Brazil', 
       'Canada', 
       'China', 
       'France', 
       'Germany', 
       'India', 
       'Indonesia', 
       'Italy',
       'Japan',
       'Mexico',
       'South Korea',
       'Russia',
       'Saudi Arabia',
       'South Africa',
       'Turkey',
       'United Kingdom',
       'United States',
       'Eropean Union',
       ]

dfworld = dfCo2[dfCo2['Entity']=='World'][['Year','Annual CO₂ emissions']]

dfMworld = dfMet[dfMet['Entity']=='World'][['Year','Annual methane emissions']]

dfNitworld = dfNit[dfNit['Entity']=='World'][['Year','Annual nitrous oxide emissions']]

dfPop = dfPop[(dfPop["Country name"].isin(G20))]

#Trim the data of the dfPop
dfCo2 = dfCo2[(dfCo2["Entity"].isin(G20))]
dfGdp = dfGdp[(dfGdp["Entity"].isin(G20))]
dfMet = dfMet[(dfMet["Entity"].isin(G20))]
dfNit = dfNit[(dfNit["Entity"].isin(G20))]
dfGhg = dfGhg[(dfGhg["Entity"].isin(G20))]


#Trim the dfPop to only have the population
dfPop = dfPop[["Country name", "Year", "Population"]]

#Add the population to the data frame
df = pd.merge(
    left = dfCo2,
    right = dfPop,
    left_on = ["Entity", "Year"],
    right_on = ["Country name", "Year"],
    how = 'inner'
)

#Clean the Merge
df= df.drop('Country name', axis=1)


#Merge the df and dfCdp

df = pd.merge(
    df,
    dfGdp,
    left_on = ["Entity", "Year"],
    right_on = ["Entity", "Year"],  
    how = 'inner'
)

#Clean the Merge

df= df.drop('Code_y', axis=1)
df= df.drop('417485-annotations', axis=1)

#Merge dfMet and dfNit
df2 = pd.merge(
    dfNit,
    dfMet,
    left_on = ["Entity", "Year"],
    right_on = ["Entity", "Year"],  
    how = 'inner'
)

#Clean the Merge
df2= df2.drop('Code_y', axis=1)

#Merge df2 and dfGhg into df3
df3 = pd.merge(
    df2,
    dfGhg,
    left_on = ["Entity", "Year"],
    right_on = ["Entity", "Year"],
    how = 'inner'
)

#Clear merge
df3= df3.drop('Code', axis=1)

#Merge df and df3 into df4
df = pd.merge(
    df,
    df3,
    left_on = ["Entity", "Year"],
    right_on = ["Entity", "Year"],
    how = 'inner'
)

#Clean up the merge
df= df.drop('Code_x_y', axis=1)

#Create the CO2 emmission per person column
df["Per Capita CO₂"] = df["Annual CO₂ emissions"] /  df["Population"]

#Create the GDP column
df["GDP"] = df["GDP per capita"] * df["Population"]

#Create the emissions per dollard column.
df["Econ Intensity"] = df["Annual CO₂ emissions"] / df["GDP"]

#Merge df and dfworld into df
df = pd.merge(
    df,
    dfworld,
    on='Year',
    how='left',
    )

#Merge df and dfMworld into df
df = pd.merge(
    df,
    dfMworld,
    on='Year',
    how='left',
    )

#Merge df and dfNitworld into df
df = pd.merge(
    df,
    dfNitworld,
    on='Year',
    how='left',
    )

#Createe the CO2 global share column
df["CO₂ Global Share"] = df["Annual CO₂ emissions_x"] / df["Annual CO₂ emissions_y"] * 100

#Drop the extra columns
df = df.drop("Annual CO₂ emissions_y", axis =1)

#Calculate Methane Global Share
df["Methane Global Share"] = df["Annual methane emissions_x"] / df["Annual methane emissions_y"] * 100
#Drop the extra columns
df = df.drop("Annual methane emissions_y", axis =1)
#Rename the columns
df = df.rename(columns={'Annual methane emissions_x': 'Annual methane emissions'})

#Calculate Nitrous Oxide Global Share
df["Nitrous Oxide Global Share"] = df["Annual nitrous oxide emissions_x"] / df["Annual nitrous oxide emissions_y"] * 100
#Drop the extra columns
df = df.drop("Annual nitrous oxide emissions_y", axis =1)
#Rename the columns
df = df.rename(columns={'Annual nitrous oxide emissions_x': 'Annual nitrous oxide emissions'})

#Create the Nitrous oxdie per population column
df["Nitrous oxide per population"] = df["Annual nitrous oxide emissions"] / df["Population"]

#Create the Methane per population column
df["Methane per population"] = df["Annual methane emissions"] / df["Population"]

#Remane the columns
df = df.rename(columns={'Code_x_x': 'Code', 'Annual CO₂ emissions_x': 'Annual CO2 emissions', 'Per Capita CO₂': 'Per Capita CO2'})
df = df.rename(columns={'CO₂ Global Share': 'CO2 Global Share'})
df = df.rename(columns={'Annual CO2 emissions': 'Annual_CO2_emissions', 'GDP per capita': 'GDP_per_capita', 'Annual nitrous oxide emissions': 'Annual_nitrous_oxide_emissions', 'Annual methane emissions': 'Annual_methane_emissions', 'Annual greenhouse gas emissions': 'Annual_greenhouse_gas_emissions', 'Per Capita CO2': 'Per_Capita_CO2', 'Econ Intensity': 'Econ_Intensity', 'CO2 Global Share':'CO2_Global_Share', 'Nitrous oxide per population': 'Nitrous_oxide_per_population', 'Methane per population': 'Methane_per_population'})

#Drop the extra columns
df = df.drop("GDP", axis =1)

#Save the data frame df to a csv
df.to_csv('prototype_csv.csv', index=False)

#Create the connection to the redshift database
import redshift_connector
connection = redshift_connector.connect(
    host='redshift-cluster-1.cyc20gzqgeyd.us-east-1.redshift.amazonaws.com',
    database='dev',
    port=5439,
    user='awsuser',
    password='Fall2022'    
)

cursor = connection.cursor()

#Create execute_query function
def execute_query(connection,query):
    cursor = connection.cursor()
    cursor.execute(query)
    connection.commit()
    print("Query successful")

#Drop the G20 table on redshift
drop_G20_table = """
drop table G20;
"""
execute_query(connection, drop_G20_table)

#Create the G20 table on redshift
create_G20_table = """
create table G20(
    Entity VARCHAR(50),
    Code VARCHAR(50),
    Year INT,
    Annual_CO2_emissions BIGINT,
    Population BIGINT,
    GDP_per_capita BIGINT,
    Annual_nitrous_oxide_emissions BIGINT,
    Annual_methane_emissions BIGINT,
    Annual_greenhouse_gas_emissions BIGINT,
    Per_Capita_CO2 FLOAT,
    Econ_Intensity FLOAT,
    CO2_Global_Share FLOAT,
    Nitrous_oxide_per_population FLOAT,
    Methane_per_population FLOAT);
"""
#Connect to the redshift db and execute the query.
execute_query(connection, create_G20_table)   

def execute_list_test_query(connection, sql):
    cursor = connection.cursor()
    try:
        cursor.execute(sql, val)
        connection.commit()
        print("Query successful")
    except Error as err:
        print(f"Error:'{err}'")

#Populate the redshift G20Table
def execute_list_query(connection, sql, val):
    cursor = connection.cursor()
    try:
        cursor.executemany(sql, val)
        connection.commit()
        print("Query successful")
    except Error as err:
        print(f"Error:'{err}'")

        
populate_G20_Table = """
    INSERT INTO g20 (Entity,
    Code,
    Year,
    Annual_CO2_emissions,
    Population,
    GDP_per_capita,
    Annual_nitrous_oxide_emissions,
    Annual_methane_emissions,
    Annual_greenhouse_gas_emissions,
    Per_Capita_CO2,
    Econ_Intensity,
    CO2_Global_Share,
    Nitrous_oxide_per_population,
    Methane_per_population)
    VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s);
"""
val = df.values.tolist()

execute_list_query(connection, populate_G20_Table, val)


