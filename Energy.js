import React, { useState, useContext } from "react";
import Navbar from "./home/Navbar";
import ModulesNav from "./ModulesNav";
import "./Form.css";
import { AuthContext } from "./Authentication/AuthContext";
import energyBg from "./images/energy.jpg";
import Chatbot from "./Chatbot";

const Energy = () => {
  const { user } = useContext(AuthContext);
  const [energyType, setEnergyType] = useState("electricity");
  const [consumption, setConsumption] = useState("");
  const [emissions, setEmissions] = useState(null);
  const [category, setCategory] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setEmissions(null);
    setCategory("");
    setRecommendations([]);

    try {
      const response = await fetch("http://localhost:5000/predict/energy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          energy_type: energyType,
          energy_consumption: parseFloat(consumption),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Prediction failed.");
      }

      setEmissions(data.emission);
      setCategory(data.emission_category);
      setRecommendations(data.recommendations);

      // Save to backend if user is logged in
      if (user && user._id) {
        await fetch("http://localhost:8000/api/emissions/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user._id,
            category: "Energy",
            emissionValue: parseFloat(data.emission.toFixed(2)),
            details: {
              energyType,
              consumption,
            },
          }),
        });
      }
    } catch (err) {
      console.error("Error:", err);
      setError(err.message || "Something went wrong.");
    }
  };

  return (
    <div>
      <Navbar />
      <div
        className="form-background"
        style={{ backgroundImage: `url(${energyBg})` }}
      >
        <div className="form-layout">
          <ModulesNav />
          <div className="form-container">
            <h2>Watt's Your Footprint?</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Energy Type:
                <select
                  value={energyType}
                  onChange={(e) => setEnergyType(e.target.value)}
                >
                  <option value="electricity">Electricity</option>
                  <option value="lpg">LPG</option>
                  <option value="kerosene">Kerosene</option>
                  <option value="natural_gas">Natural Gas</option>
                </select>
              </label>

              <label>
                Energy Consumption (units/month):
                <input
                  type="number"
                  value={consumption}
                  onChange={(e) => setConsumption(e.target.value)}
                  required
                  placeholder="Enter amount used"
                />
              </label>

              <button type="submit">Calculate Emissions</button>
            </form>

            {emissions !== null && (
              <div className="results-box">
                <h3>Your Energy Emissions: {emissions.toFixed(2)} kg CO₂</h3>

                {category === "Low" && (
                  <p className="emission-message low">
                    ✅ Your emissions are low. Great job!
                  </p>
                )}
                {category === "Medium" && (
                  <p className="emission-message medium">
                    ⚠️ Your emissions are moderate. Consider improvements.
                  </p>
                )}
                {category === "High" && (
                  <p className="emission-message high">
                    ❌ Your emissions are high. Please take action!
                  </p>
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
      <Chatbot/>
    </div>
  );
};

export default Energy;
