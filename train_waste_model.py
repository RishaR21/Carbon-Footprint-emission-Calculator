import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import OneHotEncoder
from sklearn.model_selection import train_test_split
from sklearn.pipeline import make_pipeline
from sklearn.compose import ColumnTransformer
import joblib

# Load dataset
df = pd.read_csv("waste_emission_dataset.csv")

# Features and target
X = df[["waste_type", "waste_amount", "disposal_type"]]
y = df["emission"]

# Preprocessing: One-hot encode categorical variables
categorical_features = ["waste_type", "disposal_type"]
numeric_features = ["waste_amount"]

preprocessor = ColumnTransformer([
    ("onehot", OneHotEncoder(handle_unknown="ignore"), categorical_features)
], remainder="passthrough")

# Pipeline: Preprocessing + Model
model = make_pipeline(
    preprocessor,
    RandomForestRegressor(n_estimators=100, random_state=42)
)

# Train-test split and training
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
model.fit(X_train, y_train)

# Save model and encoder
joblib.dump(model, "waste_emission_model.pkl")
print("Model saved as 'waste_emission_model.pkl'.")
