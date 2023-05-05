# Import basic data tools
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import sys
import io
import redshift_connector
import sqlalchemy

# Import the data
#data = 'prototype_csv.csv'

# Connection to redshift
connection = redshift_connector.connect(
    host='redshift-cluster-1.cyc20gzqgeyd.us-east-1.redshift.amazonaws.com',
    database='dev',
    port=5439,
    user='awsuser',
    password='Fall2022'
)

# Connection cursor
cursor = connection.cursor()

# Redshift query
query = """
    SELECT * FROM G20
"""

# Read the data into a dataframe
df = pd.read_sql(query, connection)

# Read the data into a dataframe
#df = pd.read_csv(data)

# Define a list of G20 countries for the user to select from.
g20_countries = ['Argentina', 'Australia', 'Brazil', 'Canada', 'China', 'France', 'Germany', 'India', 'Indonesia',
                 'Italy', 'Japan', 'Mexico', 'Russia', 'Saudi Arabia', 'South Africa', 'South Korea', 'Turkey',
                 'United Kingdom', 'United States', 'European Union']

# Define a list of plot types for the user to select from.
plot_types = ['annual_co2_emissions', 'per_capita_co2', 'econ_intensity',
              'annual_nitrous_oxide_emissions', 'annual_methane_emissions', 'co2_global_share', 
              'nitrous_oxide_per_population', 'methane_per_population']

# Define the function that generates the plot
def plot_gen(countries, plot_type):    
    # Check if all input countries are valid G20 countries
    invalid_countries = [c for c in countries if c not in g20_countries]
    if invalid_countries:
        print(f"Invalid countries: {', '.join(invalid_countries)}")
        return

    # Check if the input plot type is valid
    if plot_type not in plot_types:
        print(f"Invalid plot type: {plot_type}")
        return
    
    # Plot the dataframe with the selected entities
    df_plot = df[(df["entity"].isin(countries))]

    print (df_plot)
    # Select the style of the graph
    plt.style.use("ggplot")
    fig, axs = plt.subplots()
    sns.lineplot(data=df_plot, x="year", y=plot_type, hue="entity", ax=axs)
    plt.title(plot_type)

    # Send the image data in chunks
    img_bytes = io.BytesIO()
    plt.savefig(img_bytes, format='png')
    img_bytes.seek(0)

    # Split the image into smaller chunks
    chunk_size = 1024
    while True:
        chunk = img_bytes.read(chunk_size)
        if not chunk:
            break
        sys.stdout.buffer.write(chunk)
        sys.stdout.buffer.flush()
        
    #plt.savefig("./images/graph")
    #print("File Saved")
    #plt.show()

# Country arguments received.
countries = sys.argv[1].split(',')
# Plot type argument received.
plot_type = sys.argv[2]

plot_gen(countries, plot_type)