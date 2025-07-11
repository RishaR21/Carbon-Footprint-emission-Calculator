import pandas as pd
import numpy as np
import random

# Emission factors
emission_factors = {
    'grid': 0.85,
    'solar': 0.05,
    'wind': 0.02
}

def calculate_emission(usage, source):
    return usage * emission_factors[source]

def emission_category(emission):
    if emission <= 100:
        return "Low"
    elif emission <= 300:
        return "Medium"
    else:
        return "High"

# Generate 500 samples
data = []
sources = ['grid', 'solar', 'wind']

for _ in range(500):
    usage = round(random.uniform(50, 600), 2)  # kWh/month
    source = random.choice(sources)
    emission = calculate_emission(usage, source)
    category = emission_category(emission)
    data.append({
        "electricity_usage": usage,
        "electricity_source": source,
        "emission": round(emission, 2),
        "emission_category": category
    })

# Create DataFrame
df = pd.DataFrame(data)

# Save dataset
df.to_csv("electricity_emissions_dataset.csv", index=False)
print("Dataset saved as electricity_emissions_dataset.csv")
