# Import basic data tools
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import sys
import io

# Import the data
data = 'prototype_csv.csv'

# Read the data into a dataframe
df = pd.read_csv(data)

# Define a list of G20 countries for the user to select from.
g20_countries = ['Argentina', 'Australia', 'Brazil', 'Canada', 'China', 'France', 'Germany', 'India', 'Indonesia',
                 'Italy', 'Japan', 'Mexico', 'Russia', 'Saudi Arabia', 'South Africa', 'South Korea', 'Turkey',
                 'United Kingdom', 'United States', 'European Union']

# Define a list of plot types for the user to select from.
plot_types = ['Annual CO2 emissions', 'Per Capita CO2', 'Carbon emission intensity of economies',
              'Annual nitrous oxide emissions', 'Annual methane emissions', 'CO2 Global Share', 
              'Nitrous oxide per population', 'Methane per population']

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
    df_plot = df[(df["Entity"].isin(countries))]
    # Select the style of the graph
    plt.style.use("ggplot")
    fig, axs = plt.subplots()
    sns.lineplot(data=df_plot, x="Year", y=plot_type, hue="Entity", ax=axs)
    plt.title(plot_type)

    # Send the image data in chunks
    img_bytes = io.BytesIO()
    plt.savefig(img_bytes, format='png')
    img_bytes.seek(0)

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