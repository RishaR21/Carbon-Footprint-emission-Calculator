import pandas as pd
import random

# Define sample emission factors (kg CO₂ per km) for different transport modes and fuel types
emission_factors = {
    "car": {"petrol": 0.21, "diesel": 0.25, "electric": 0.1},
    "bus": {"diesel": 0.09, "electric": 0.04},
    "train": {"electric": 0.05, "diesel": 0.07},
    "bike": {"none": 0.0},
    "walk": {"none": 0.0}
}

transport_modes = ["car", "bus", "train", "bike", "walk"]
fuel_types = {
    "car": ["petrol", "diesel", "electric"],
    "bus": ["diesel", "electric"],
    "train": ["electric", "diesel"],
    "bike": ["none"],
    "walk": ["none"]
}

# Generate synthetic data
data = []
for _ in range(500):  # 500 samples
    mode = random.choice(transport_modes)
    fuel = random.choice(fuel_types[mode])
    distance = round(random.uniform(1, 100), 2)  # Distance in km

    emission = round(emission_factors[mode][fuel] * distance, 2)
    data.append({
        "transport_mode": mode,
        "fuel_type": fuel,
        "distance": distance,
        "emission": emission
    })

# Save to CSV
df = pd.DataFrame(data)
df.to_csv("transportation_emissions.csv", index=False)
print("Dataset saved to transportation_emissions.csv")
