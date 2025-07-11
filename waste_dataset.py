import pandas as pd
import random

# Emission factors by waste type and disposal method (in kg CO₂ per kg of waste)
emission_factors = {
    "organic": {"landfill": 0.3, "recycling": 0.1, "composting": 0.05},
    "plastic": {"landfill": 2.5, "recycling": 1.2, "incineration": 3.0},
    "paper": {"landfill": 1.5, "recycling": 0.8, "incineration": 1.8},
    "metal": {"landfill": 1.8, "recycling": 0.7, "incineration": 2.0},
    "glass": {"landfill": 1.2, "recycling": 0.5, "incineration": 1.4},
}

waste_types = list(emission_factors.keys())
disposal_methods = list({method for types in emission_factors.values() for method in types})

data = []

for _ in range(500):
    waste_type = random.choice(waste_types)
    available_disposals = list(emission_factors[waste_type].keys())
    disposal_type = random.choice(available_disposals)
    waste_amount = round(random.uniform(1, 30), 2)  # waste in kg

    emission = round(waste_amount * emission_factors[waste_type][disposal_type], 2)

    # Emission category
    if emission < 5:
        category = "Low"
    elif emission < 15:
        category = "Medium"
    else:
        category = "High"

    data.append({
        "waste_type": waste_type,
        "waste_amount": waste_amount,
        "disposal_type": disposal_type,
        "emission": emission,
        "category": category
    })

df = pd.DataFrame(data)
df.to_csv("waste_emission_dataset.csv", index=False)

print("Waste dataset generated and saved as 'waste_emission_dataset.csv'.")
