import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error
import joblib

# Load dataset
df = pd.read_csv("electricity_emissions_dataset.csv")

# Separate features and target
X = df[["electricity_usage", "electricity_source"]]
y = df["emission"]

# One-hot encode the 'electricity_source' column
encoder = OneHotEncoder(sparse_output=False)
X_encoded = encoder.fit_transform(X[["electricity_source"]])
X_final = pd.concat([
    X[["electricity_usage"]].reset_index(drop=True),
    pd.DataFrame(X_encoded, columns=encoder.get_feature_names_out(["electricity_source"]))
], axis=1)

# Split the data
X_train, X_test, y_train, y_test = train_test_split(X_final, y, test_size=0.2, random_state=42)

# Train model
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Evaluate
y_pred = model.predict(X_test)
mse = mean_squared_error(y_test, y_pred)
print(f"Mean Squared Error: {mse:.2f}")

# Save model and encoder
joblib.dump(model, "electricity_emission_model.pkl")
joblib.dump(encoder, "electricity_source_encoder.pkl")
print("Model and encoder saved.")
