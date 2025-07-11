import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "./logo1.png";
import "./Home.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignIn = (e) => {
    e.preventDefault();
    navigate("/createAcc");
  };

  const handleHomeClick = (e) => {
    e.preventDefault();
    if (location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/");
    }
  };

  const handleMissionClick = (e) => {
    e.preventDefault();
    if (location.pathname === "/") {
      const missionSection = document.getElementById("mission");
      if (missionSection) {
        missionSection.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate("/?scrollToMission=true");
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  const getInitials = (name) => name?.charAt(0)?.toUpperCase() || "";

  return (
    <nav
      className="navbar sticky-top navbar-expand-lg navbar-light bg-light"
      id="top_nav"
    >
      <div className="container-fluid">
        <img src={logo} alt="Logo" className="img-fluid" id="logo" />
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link active" href="#" onClick={handleHomeClick}>
                Home
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link active"
                href="#"
                onClick={handleMissionClick}
              >
                Mission
              </a>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Calculate
              </a>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                <li>
                  <a
                    className="dropdown-item"
                    href="#"
                    onClick={() => navigate("/transport")}
                  >
                    Transport
                  </a>
                </li>
                <li>
                  <a
                    className="dropdown-item"
                    href="#"
                    onClick={() => navigate("/waste")}
                  >
                    Waste
                  </a>
                </li>
                <li>
                  <a
                    className="dropdown-item"
                    href="#"
                    onClick={() => navigate("/diet")}
                  >
                    Diet
                  </a>
                </li>
                <li>
                  <a
                    className="dropdown-item"
                    href="#"
                    onClick={() => navigate("/energy")}
                  >
                    Energy
                  </a>
                </li>
                <li>
                  <a
                    className="dropdown-item"
                    href="#"
                    onClick={() => navigate("/electricity")}
                  >
                    Electricity
                  </a>
                </li>
              </ul>
            </li>
          </ul>

          {/* Authentication Section */}
          {user ? (
            <div className="user-menu">
              <div
                className="user-avatar"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {getInitials(user.username)}
              </div>
              {menuOpen && (
                <div className="user-dropdown">
                  <button onClick={() => navigate("/dashboard")}>
                    Profile
                  </button>
                  <button onClick={handleSignOut}>Sign Out</button>
                </div>
              )}
            </div>
          ) : (
            <form className="d-flex" id="sign-in" onSubmit={handleSignIn}>
              <button className="btn pt-0 pr-0 text-white btn_signin" type="submit">
                Sign In
              </button>
            </form>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;