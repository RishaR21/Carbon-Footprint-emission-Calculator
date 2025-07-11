import pandas as pd
import random

# Define emission factors for different energy types
emission_factors = {
    "lpg": 2.9,
    "natural_gas": 2.1,
    "kerosene": 3.0,
    "coal": 4.0,
    "biomass": 1.2,
    "electricity": 1.8  # Include electricity now
}

data = []

for _ in range(300):
    energy_type = random.choice(list(emission_factors.keys()))
    consumption = round(random.uniform(5, 200), 2)
    emission = round(consumption * emission_factors[energy_type], 2)

    data.append({
        "energy_type": energy_type,
        "energy_consumption": consumption,
        "emission": emission
    })

df = pd.DataFrame(data)
df.to_csv("energy_emissions.csv", index=False)
