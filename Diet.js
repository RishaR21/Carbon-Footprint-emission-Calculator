import React, { useState, useContext } from "react";
import "./Form.css";
import { AuthContext } from "./Authentication/AuthContext";
import Navbar from "./home/Navbar";
import ModulesNav from "./ModulesNav";
import dietBg from "./images/diet.jpg";
import Chatbot from "./Chatbot";


function DietForm() {
  const { user } = useContext(AuthContext);

  const [data, setData] = useState({
    meat: "",
    dairy: "",
    organic: "",
    foodWaste: "",
  });

  const [emissions, setEmissions] = useState(null);
  const [category, setCategory] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState(null);

  const emissionFactors = {
    meat: 27.0,
    dairy: 3.2,
    foodWaste: 2.5,
    organicReduction: 0.5, // 50% reduction
  };

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const meat = parseFloat(data.meat) || 0;
    const dairy = parseFloat(data.dairy) || 0;
    const foodWaste = parseFloat(data.foodWaste) || 0;
    const organicPercent = (parseFloat(data.organic) || 0) / 100;

    let emission =
      meat * emissionFactors.meat +
      dairy * emissionFactors.dairy +
      foodWaste * emissionFactors.foodWaste;
    emission -= emission * (organicPercent * emissionFactors.organicReduction);

    const roundedEmission = emission.toFixed(2);
    setEmissions(roundedEmission);

    // ---- Step 1: Get category + recommendations from ML model ----
    try {
      const response = await fetch("http://localhost:5000/predict/diet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          meat,
          dairy,
          organic: parseFloat(data.organic) || 0,
          food_waste: foodWaste,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Prediction failed");
      }

      const result = await response.json();
      setCategory(result.emission_category);
      setRecommendations(result.recommendations);
      setError(null);

      // ---- Step 2: Save emission data to MongoDB ----
      if (!user || !user._id) {
        alert("User not authenticated. Please log in.");
        return;
      }

      const saveResponse = await fetch("http://localhost:8000/api/emissions/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id,
          category: "Diet",
          emissionValue: parseFloat(roundedEmission),
          details: data,
        }),
      });

      if (!saveResponse.ok) {
        alert("Failed to save diet emission data.");
      } else {
        alert("Diet emission data saved successfully!");
      }

    } catch (err) {
      console.error("Error:", err);
      setError("Failed to get prediction or save data. Check server.");
    }
  };

  return (
    <div>
      <Navbar/>
      <div className="form-background" style={{ backgroundImage:`url(${dietBg})` }}>
        <div className="form-layout">
          <ModulesNav/>
          <div className="form-container">
            <h2>Carbon On The Menu!!</h2>
            <form onSubmit={handleSubmit}>
              <label>Meat Consumption (kg per week):</label>
              <input
                type="number"
                name="meat"
                placeholder="e.g., 2"
                onChange={handleChange}
                required
              />

              <label>Dairy Consumption (liters per week):</label>
              <input
                type="number"
                name="dairy"
                placeholder="e.g., 1.5"
                onChange={handleChange}
                required
              />

              <label>Percentage of Organic Food (%):</label>
              <input
                type="number"
                name="organic"
                placeholder="e.g., 40"
                onChange={handleChange}
                required
              />

              <label>Food Waste (kg per week):</label>
              <input
                type="number"
                name="foodWaste"
                placeholder="e.g., 0.5"
                onChange={handleChange}
                required
              />

              <button type="submit">Calculate Diet Emission</button>
            </form>

            {emissions && (
              <div className="results-box">
                <h3>Your Diet Carbon Emission: {emissions} kg CO₂</h3>

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
}

export default DietForm;
