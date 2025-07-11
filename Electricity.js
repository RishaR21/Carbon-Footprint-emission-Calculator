import React, { useState, useContext } from "react";
import Navbar from "./home/Navbar";
import ModulesNav from "./ModulesNav";
import "./Form.css";
import { AuthContext } from "./Authentication/AuthContext";
import electricityBg from "./images/electricity.jpg";
import Chatbot from "./Chatbot";

const Electricity = () => {
  const { user } = useContext(AuthContext);
  const [usage, setUsage] = useState("");
  const [source, setSource] = useState("grid");
  const [duration, setDuration] = useState("monthly");
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

    let usageValue = parseFloat(usage) || 0;
    if (duration === "yearly") usageValue = usageValue / 12;

    try {
      const response = await fetch("http://localhost:5000/predict/electricity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          electricity_usage: usageValue,
          electricity_source: source,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Prediction failed");
      }

      const data = await response.json();
      setEmissions(data.predicted_emission);
      setCategory(data.emission_category);
      setRecommendations(data.recommendations);

      if (user && user._id) {
        await fetch("http://localhost:8000/api/emissions/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user._id,
            category: "Electricity",
            emissionValue: parseFloat(data.predicted_emission.toFixed(2)),
            details: {
              usage,
              source,
              duration,
            },
          }),
        });
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to get prediction. Check server logs or CORS.");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="form-background" style={{ backgroundImage: `url(${electricityBg})` }}>
        <div className="form-layout">
          <ModulesNav />
          <div className="form-container">
            <h2>The Current Count!!</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Electricity Usage (kWh):
                <input
                  type="number"
                  value={usage}
                  onChange={(e) => setUsage(e.target.value)}
                  required
                  placeholder="Enter electricity usage"
                />
              </label>

              <label>
                Electricity Source:
                <select value={source} onChange={(e) => setSource(e.target.value)}>
                  <option value="grid">Grid Mix</option>
                  <option value="coal">Coal</option>
                  <option value="naturalGas">Natural Gas</option>
                  <option value="renewable">Renewable Energy</option>
                </select>
              </label>

              <label>
                Duration:
                <select value={duration} onChange={(e) => setDuration(e.target.value)}>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </label>

              <button type="submit">Calculate Emissions</button>
            </form>

            {emissions !== null && (
              <div className="results-box">
                <h3>Your Electricity Emissions: {emissions.toFixed(2)} kg CO₂</h3>

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

export default Electricity;
