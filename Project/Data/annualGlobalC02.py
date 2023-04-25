#Import libraries
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

#Create dataframe
co2 = 'annual-co2-emissions-per-country.csv'
print(co2)
df = pd.read_csv(co2)

#Make the first graph.
#Anual CO2 emissions per country.

#Select the countries to be displayed.
#Palce holder
countries = ["Canada", "United States", "United Kingdom", "China", "Japan"]

#Plot the dataframe with the seleced entities.
df_plot = df[(df["Entity"].isin(countries))]

#Select the style of the graph.
plt.style.use("ggplot")

fig , axs = plt.subplots() 

sns.lineplot(
    data = df_plot,
    x="Year",
    y="Annual CO₂ emissions",
    hue="Entity",
    ax=axs,
)
plt.title("Annual CO₂ emissions per Countries")
#plt.show()
plt.savefig("../BackEnd/graphs/annual_CO2_emissions_per_Countries")
print("File Saved")