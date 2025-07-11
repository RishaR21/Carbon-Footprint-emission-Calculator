import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import classification_report
import joblib

# Load the dataset
df = pd.read_csv("diet_emissions_dataset.csv")  # Update path if needed

# Encode the target label
label_encoder = LabelEncoder()
df["emission_category_encoded"] = label_encoder.fit_transform(df["emission_category"])

# Features and target
X = df[["meat", "dairy", "organic", "food_waste"]]
y = df["emission_category_encoded"]

# Split the dataset
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train the model
model = RandomForestClassifier(random_state=42)
model.fit(X_train, y_train)

# Evaluate the model
y_pred = model.predict(X_test)
report = classification_report(y_test, y_pred, target_names=label_encoder.classes_)
print("Classification Report:\n", report)

# Save the model and label encoder
joblib.dump(model, "diet_emission_model.pkl")
joblib.dump(label_encoder, "diet_label_encoder.pkl")

print("✅ Model and label encoder saved successfully.")
