import React, { useState, useContext } from "react";
import Navbar from "./home/Navbar";
import ModulesNav from "./ModulesNav";
import "./Form.css";
import { AuthContext } from "./Authentication/AuthContext";
import wasteBg from "./images/waste.jpg";
import Chatbot from "./Chatbot";

const Waste = () => {
  const { user } = useContext(AuthContext);
  const [wasteType, setWasteType] = useState("");
  const [wasteAmount, setWasteAmount] = useState("");
  const [disposalType, setDisposalType] = useState("");
  const [emissions, setEmissions] = useState(null);
  const [category, setCategory] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setEmissions(null);
    setCategory("");
    setRecommendations([]);

    try {
      const response = await fetch("http://localhost:5000/predict/waste", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          waste_type: wasteType,
          waste_amount: parseFloat(wasteAmount),
          disposal_type: disposalType,
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

      // Save emission if user is logged in
      if (user && user._id) {
        const saveResponse = await fetch("http://localhost:8000/api/emissions/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user._id,
            category: "Waste",
            emissionValue: parseFloat(data.predicted_emission.toFixed(2)),
            details: {
              wasteType,
              amount: wasteAmount,
              disposal: disposalType,
            },
          }),
        });

        if (!saveResponse.ok) {
          console.warn("Emission saved failed.");
        }
      } else {
        console.warn("User not authenticated, data not saved.");
      }

    } catch (err) {
      setError(err.message || "Something went wrong.");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="form-background" style={{ backgroundImage: `url(${wasteBg})` }}>
        <div className="form-layout">
          <ModulesNav />
          <div className="form-container">
            <h2>Waste Not, Emit Not!!</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Waste Type:
                <select value={wasteType} onChange={(e) => setWasteType(e.target.value)} required>
                  <option value="">Select Type</option>
                  <option value="organic">Organic</option>
                  <option value="plastic">Plastic</option>
                  <option value="paper">Paper</option>
                </select>
              </label>

              <label>
                Waste Amount (kg):
                <input
                  type="number"
                  value={wasteAmount}
                  onChange={(e) => setWasteAmount(e.target.value)}
                  required
                  placeholder="Enter waste amount in kg"
                />
              </label>

              <label>
                Disposal Type:
                <select value={disposalType} onChange={(e) => setDisposalType(e.target.value)} required>
                  <option value="">Select Method</option>
                  <option value="recycling">Recycling</option>
                  <option value="landfill">Landfill</option>
                  <option value="incineration">Incineration</option>
                  <option value="composting">Composting</option>
                </select>
              </label>

              <button type="submit">Calculate Emissions</button>
            </form>

            {emissions !== null && (
              <div className="results-box">
                <h3>Your Waste Emissions: {emissions.toFixed(2)} kg CO₂</h3>

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
      <Chatbot/>
    </div>
  );
};

export default Waste;
