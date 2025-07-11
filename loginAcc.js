import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles.css";

const Login = () => {
  const navigate = useNavigate();
  const passwordRef = useRef(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      alert("All fields are required!");
      return;
    }

    try {
      const res = await axios.post("http://localhost:8000/api/users/login", {
        email,
        password,
      });

      if (res.status === 200) {
        // Login successful
        const user = res.data.user;
        localStorage.setItem("user", JSON.stringify(user));
        navigate("/");
        window.location.reload();
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        // Invalid credentials
        alert("Invalid email or password.");
        setPassword(""); // Optionally clear password field
      } else {
        // General error handling
        alert("An error occurred. Please try again later.");
      }
    }
  };

  return (
    <div className="background">
      <div className="container">
        <div className="form-section">
          <h2>Login</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                passwordRef.current?.focus();
              }
            }}
          />
          <input
            type="password"
            placeholder="Password"
            ref={passwordRef}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleLogin();
              }
            }}
          />
          <button onClick={handleLogin}>Login</button>
          <p>
            Don't have an account?{" "}
            <span onClick={() => navigate("/")} className="link">
              Sign Up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;