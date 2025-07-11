import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
import joblib

# Load dataset
df = pd.read_csv("transportation_emissions.csv")

# Features and target
X = df[["transport_mode", "fuel_type", "distance"]]
y = df["emission"]

# Preprocessing: One-hot encode categorical variables
categorical_features = ["transport_mode", "fuel_type"]
preprocessor = ColumnTransformer(
    transformers=[
        ("cat", OneHotEncoder(handle_unknown="ignore"), categorical_features)
    ],
    remainder="passthrough"  # keep distance as is
)

# Build pipeline
model = Pipeline(steps=[
    ("preprocessor", preprocessor),
    ("regressor", RandomForestRegressor(n_estimators=100, random_state=42))
])

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train model
model.fit(X_train, y_train)

# Save trained model
joblib.dump(model, "transportation_emission_model.pkl")
print("Model saved to transportation_emission_model.pkl")
