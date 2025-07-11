import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
import joblib

# Load the dataset
df = pd.read_csv("energy_emissions.csv")

# Encode the categorical variable 'energy_type'
label_encoder = LabelEncoder()
df["energy_type_encoded"] = label_encoder.fit_transform(df["energy_type"])

# Features and target
X = df[["energy_type_encoded", "energy_consumption"]]
y = df["emission"]

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train the regression model
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Save the trained model and label encoder
joblib.dump(model, "energy_emission_model.pkl")
joblib.dump(label_encoder, "energy_type_encoder.pkl")

print("Model and encoder saved successfully.")
