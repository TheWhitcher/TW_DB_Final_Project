# Import basic data tools
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import sys

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
    print(countries)
    print(plot_type)
    # Convert user input string to a list of countries
    #countries = countries.split(',')
    
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
    plt.savefig("./images/graph")
    print("File Saved")
    #plt.show()

# Country arguments received.
countries = sys.argv[1].split(',')
# Plot type argument received.
plot_type = sys.argv[2]

# Ask the user to enter the countries to be displayed
#countries = input("Enter the countries to be displayed (separate by comma if multiple): ")
# Ask the user to enter the type of plot to be displayed
#plot_type = input("Enter the type of plot to be displayed: ")
# Generate the plot
plot_gen(countries, plot_type)