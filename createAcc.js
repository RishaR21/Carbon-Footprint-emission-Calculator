import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles.css";

const CreateAccount = () => {
  const navigate = useNavigate();
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleCreateAccount = async () => {
    if (!username || !email || !password) {
      alert("All fields are required!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/api/users/register", {
        username,
        email,
        password,
      });

      if (response && response.data) {
        alert("Account created successfully!");
        navigate("/login");
      }
    } catch (error) {
      console.error("Error during account creation:", error);
      const errorMessage =
        error?.response?.data?.error || "Something went wrong. Please try again.";
      alert(errorMessage);
    }
  };

  return (
    <div className="background">
      <div className="container">
        <div className="form-section">
          <h2>Create Account</h2>

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                emailRef.current?.focus();
              }
            }}
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            ref={emailRef}
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
            value={password}
            ref={passwordRef}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleCreateAccount();
              }
            }}
          />

          <button onClick={handleCreateAccount}>Create Account</button>
          <p>
            Already have an account?{" "}
            <span onClick={() => navigate("/login")} className="link">
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateAccount;