import React, { useState, useContext } from "react";
import "./Form.css";
import ModulesNav from "./ModulesNav";
import Navbar from "./home/Navbar";
import Chatbot from "./Chatbot";
import { AuthContext } from "./Authentication/AuthContext";
import transportBg from "./images/transport.jpg";


const Transportation = () => {
  const { user } = useContext(AuthContext);
  const [transportMode, setTransportMode] = useState("car");
  const [fuelType, setFuelType] = useState("petrol");
  const [distance, setDistance] = useState("");
  const [emissions, setEmissions] = useState(null);
  const [category, setCategory] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Prediction request
      const predictionResponse = await fetch("http://localhost:5000/predict/transportation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transport_mode: transportMode,
          fuel_type: fuelType,
          distance: parseFloat(distance),
        }),
      });

      if (!predictionResponse.ok) {
        const err = await predictionResponse.json();
        throw new Error(err.error || "Prediction failed");
      }

      const data = await predictionResponse.json();
      setEmissions(data.predicted_emission);
      setCategory(data.emission_category);
      setRecommendations(data.recommendations);
      setError(null);

      // Save to DB
      const saveResponse = await fetch("http://localhost:8000/api/emissions/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id,
          category: "Transportation",
          emissionValue: data.predicted_emission,
          details: { transportMode, fuelType, distance },
        }),
      });

      if (!saveResponse.ok) {
        console.error("Failed to save emission data.");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to calculate or save emissions.");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="form-background" style={{ backgroundImage: `url(${transportBg})` }}>
        <div className="form-layout">
          <ModulesNav />
          <div className="form-container">
            <h2>Your Ride,Your Residue!!</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Transport Mode:
                <select value={transportMode} onChange={(e) => setTransportMode(e.target.value)}>
                  <option value="car">Car</option>
                  <option value="bus">Bus</option>
                  <option value="train">Train</option>
                  <option value="bike">Bike</option>
                  <option value="walk">Walk</option>
                </select>
              </label>

              <label>
                Fuel Type:
                <select value={fuelType} onChange={(e) => setFuelType(e.target.value)}>
                  <option value="petrol">Petrol</option>
                  <option value="diesel">Diesel</option>
                  <option value="electric">Electric</option>
                  <option value="none">None</option>
                </select>
              </label>

              <label>
                Distance Travelled (km):
                <input
                  type="number"
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  required
                  placeholder="Enter distance in kilometers"
                />
              </label>

              <button type="submit">Calculate Emissions</button>
            </form>

            {emissions !== null && (
              <div className="results-box">
                <h3>Your Transport Emissions: {emissions.toFixed(2)} kg CO₂</h3>

                {category === "Low" && (
                  <p className="emission-message low">✅ Your emissions are low. Great job!</p>
                )}
                {category === "Medium" && (
                  <p className="emission-message medium">⚠️ Your emissions are moderate. Consider improvements.</p>
                )}
                {category === "High" && (
                  <p className="emission-message high">❌ Your emissions are high. Please take action!</p>
                )}

                {recommendations.length > 0 && (
                  <div className="recommendation-box">
                    <h4>Recommendations:</h4>
                    <ul>
                      {recommendations.map((rec, index) => (
                        <li key={index}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {error && <p style={{ color: "red" }}>{error}</p>}
          </div>
        </div>
      </div>
      <Chatbot />
    </div>
  );
};

export default Transportation;
