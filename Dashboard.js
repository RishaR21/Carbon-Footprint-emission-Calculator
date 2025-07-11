import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Line, Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js/auto";
import "./Dashboard.css";
import Chatbot from "../Chatbot";

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [menuOpen, setMenuOpen] = useState(false);
  const [emissions, setEmissions] = useState([]);
  const transportRef = useRef(null);
  const wasteRef = useRef(null);
  const dietRef = useRef(null);
  const energyRef = useRef(null);
  const electricityRef = useRef(null);
  const contactRef = useRef(null);
  const [newUsername, setNewUsername] = useState(user.username);
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [newEmail, setNewEmail] = useState(user.email);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showEditForm, setShowEditForm] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);


  const getInitials = (name) => name?.[0]?.toUpperCase() || "";

  const handleSignOut = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const scrollToSection = (ref) => {
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleProfileUpdate = async () => {
    setMessage("");
    if (newPassword && newPassword !== confirmPassword) {
      return setMessage("Passwords do not match.");
    }

    const updatedFields = {};
    if (newUsername.trim() && newUsername !== user.username)
      updatedFields.username = newUsername;
    if (newEmail.trim() && newEmail !== user.email)
      updatedFields.email = newEmail;
    if (newPassword.trim()) updatedFields.password = newPassword;

    try {
      const response = await fetch(
        `http://localhost:5000/api/users/${user._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedFields),
        }
      );

      const data = await response.json();
      if (response.ok) {
        const updatedUser = {
          ...user,
          username: data.username || newUsername,
          email: data.email || newEmail,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setMessage("✅ Profile updated successfully.");
        window.location.reload();
      } else {
        setMessage(data.message || "❌ Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage("❌ An error occurred. Please try again.");
    }
  };

  const handleEditClick = () => {
    setNewUsername(user.username);
    setNewEmail(user.email);
    setNewPassword("");
    setConfirmPassword("");
    setShowEditForm(true);
  };

  useEffect(() => {
    if (user?._id) {
      const fetchEmissions = async () => {
        try {
          const response = await fetch(
            `http://localhost:8000/api/emissions/${user._id}`
          );
          const data = await response.json();
          setEmissions(data);
        } catch (error) {
          console.error("Error fetching emissions data:", error);
        }
      };
      fetchEmissions();
    }
  }, [user?._id]);

  if (!user) return <h2>Please login to access the dashboard.</h2>;

  const categoryColors = {
    Transportation: "rgb(190, 87, 109)",
    Waste: "rgb(52, 157, 157)",
    Diet: "rgb(28, 149, 15)",
    Electricity: "rgb(249, 222, 47)",
    Energy: "rgb(195, 16, 16)",
  };

  const totalByCategory = emissions.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.emissionValue;
    return acc;
  }, {});

  const pieChartData = {
    labels: Object.keys(totalByCategory),
    datasets: [
      {
        label: "Total Emissions",
        data: Object.values(totalByCategory),
        backgroundColor: Object.keys(totalByCategory).map(
          (category) => categoryColors[category] || "gray"
        ),
        borderColor: "white",
        borderWidth: 2,
      },
    ],
  };

  const EmissionChartSection = ({ title, category, refProp, getLabel }) => {
    const categoryData = emissions.filter((e) => e.category === category);
    return (
      <section ref={refProp} className="updated-emission-section">
        <h3>{title}</h3>
        {categoryData.length > 0 ? (
          <div
            style={{
              display: "flex",
              flexWrap: "nowrap",
              gap: "20px",
              alignItems: "flex-start",
              width: "100%",
            }}
          >
            <div style={{ flex: "0 0 40%", minWidth: "250px" }}>
              <ul>
                {categoryData.map((e) => (
                  <li key={e._id}>{e.emissionValue} kg CO₂</li>
                ))}
              </ul>
            </div>
            <div style={{ flex: "0 0 60%", minWidth: "300px" }}>
              <Line
                data={{
                  labels: categoryData.map(getLabel),
                  datasets: [
                    {
                      label: `${category} Emission`,
                      data: categoryData.map((e) => e.emissionValue),
                      borderColor: categoryColors[category],
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      tension: 0.3,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: true },
                    title: {
                      display: true,
                      text: `${category} Emissions`,
                    },
                  },
                  scales: {
                    x: {
                      title: {
                        display: true,
                        text: "Input",
                      },
                    },
                    y: {
                      title: {
                        display: true,
                        text: "Emission (kg CO₂)",
                      },
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </div>
          </div>
        ) : (
          <p>No {category.toLowerCase()} emission data available.</p>
        )}
      </section>
    );
  };

  return (
    <div className="updated-dashboard">
      <aside className="updated-sidebar">
        <div className="updated-profile">
          <div className="updated-profile-img">
            {getInitials(user.username)}
          </div>
          <h3>{user.username}</h3>
          <p>Welcome</p>
        </div>
        <nav>
          <ul>
            <li className="active">📁 My Profile</li>
            <li onClick={() => scrollToSection(transportRef)}>🚗 Transport</li>
            <li onClick={() => scrollToSection(wasteRef)}>🗑 Waste</li>
            <li onClick={() => scrollToSection(dietRef)}>🥗 Diet</li>
            <li onClick={() => scrollToSection(energyRef)}>⚡ Energy</li>
            <li onClick={() => scrollToSection(electricityRef)}>
              💡 Electricity
            </li>
            <li onClick={() => scrollToSection(contactRef)}>🖋 Edit Profile</li>
          </ul>
        </nav>
      </aside>

      <main className="updated-main-content">
        <header className="updated-top-nav">
          <div className="updated-weather">☀ 37° | Hyderabad, Telangana</div>
          <div className="updated-nav-icons">
          <span className="updated-chat-icon" onClick={() => setShowChatbot(!showChatbot)}>💬</span>

            <div className="updated-menu-container">
              <span
                className="updated-menu-icon"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                ☰
              </span>
              <div
                className={`updated-dropdown-menu ${menuOpen ? "show" : ""}`}
              >
                <button onClick={() => navigate("/")}>Home</button>
                <button onClick={() => navigate("/?scrollToMission=true")}>
                  Mission
                </button>
                <button onClick={handleSignOut}>Sign Out</button>
              </div>
            </div>
          </div>
        </header>

        <section className="updated-profile-summary">
          <div className="updated-user-details">
            <h2>{user.username}</h2>
            <p>📧 {user.email}</p>
            <p>
              📅 Account Created: {new Date(user.createdAt).toLocaleString()}
            </p>
          </div>
        </section>

        <section
          className="updated-emission-section"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            padding: "20px",
          }}
        >
          <div style={{ flex: 1, paddingRight: "20px" }}>
            <h3>📊 Total Emissions</h3>
            {Object.keys(totalByCategory).length > 0 ? (
              <ul style={{ listStyleType: "none", paddingLeft: "0" }}>
                {Object.entries(totalByCategory).map(([category, total]) => (
                  <li
                    key={category}
                    style={{ fontSize: "18px", marginBottom: "10px" }}
                  >
                    <strong>{category}:</strong> {total.toFixed(2)} kg CO₂
                  </li>
                ))}
              </ul>
            ) : (
              <p>No emissions data available.</p>
            )}
          </div>

          <div
            style={{
              flex: 1,
              height: "400px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            {Object.keys(totalByCategory).length > 0 && (
              <Pie data={pieChartData} options={{ responsive: true }} />
            )}
          </div>
        </section>

        <EmissionChartSection
          title="🚗 Transport Emission"
          category="Transportation"
          refProp={transportRef}
          getLabel={(e) => `${e.details?.distance || 0} km`}
        />

        <EmissionChartSection
          title="🗑 Waste Emission"
          category="Waste"
          refProp={wasteRef}
          getLabel={(e) =>
            `${e.details?.wasteType || "Type"} (${e.details?.amount || 0}kg)`
          }
        />

        <EmissionChartSection
          title="🥗 Diet Emission"
          category="Diet"
          refProp={dietRef}
          getLabel={(e) =>
            `Meat: ${e.details?.meat || 0}kg, Dairy: ${e.details?.dairy || 0}L`
          }
        />

        <EmissionChartSection
          title="⚡ Energy Emission"
          category="Energy"
          refProp={energyRef}
          getLabel={(e) => `${e.details?.fuelType || "N/A"}`}
        />

        <EmissionChartSection
          title="💡 Electricity Emission"
          category="Electricity"
          refProp={electricityRef}
          getLabel={(e) => `${e.details?.usage || 0} kWh`}
        />

        <section ref={contactRef} className="updated-edit-profile-form">
          <h3>✏ Edit Profile</h3>
          {!showEditForm ? (
            <button onClick={handleEditClick}>Edit Profile</button>
          ) : (
            <>
              <input
                type="text"
                placeholder="New Username"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
              />
              <input
                type="email"
                placeholder="New Email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={handleProfileUpdate}>Save Changes</button>
                <button onClick={() => setShowEditForm(false)}>Close</button>
              </div>
              {message && <p>{message}</p>}
            </>
          )}
        </section>
      </main>
      {showChatbot && (
  <div className="chatbot-container">
    <Chatbot/>
  </div>
)}

    </div>
  );
};

export default Dashboard;