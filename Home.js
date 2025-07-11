import "./Home.css";
import logo from "./logo1.png";
import earth from "./earth.png";
import bannerimg1 from "./bannerimg1.png";
import bannerimg2 from "./bannerimg2.png";
import { IoIosMail } from "react-icons/io";
import { FaPhone } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import React, { useRef, useEffect } from "react";
import Navbar from "./Navbar";
import Chatbot from "../Chatbot";

function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const missionRef = useRef(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    if (queryParams.get("scrollToMission") === "true") {
      missionRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [location]);

  const handleSignIn = (e) => {
    e.preventDefault();
    navigate("/createAcc");
  };

  const scrollToMission = (e) => {
    e.preventDefault();
    missionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div>
      <Navbar />
      <div className="container-fluid">
        <div className="row justify-content-center" id="banner">
          <div className="col-md-6" id="bannertext">
            <h1>
              Reducing <img src={bannerimg1} alt="nothing" id="bannerimg1" />{" "}
              Empowering <img src={bannerimg2} alt="nothing" id="bannerimg2" />{" "}
              Your journey to carbon neutrality, <br />
              Begin here
            </h1>
            <p>
              Quantify your impact with personalizes assessment embrace
              eco-challenges for green coins and join a thriving community
              united for change
            </p>
            <button
              type="button"
              className="btn"
              id="bannerbtn"
              onClick={() => navigate("/transport")}
            >
              Calculate Now
            </button>
          </div>
          <div className="col-md-4 d-none d-md-block" id="bannerimg">
            <img src={earth} alt="nothing" className="img-fluid" />
          </div>
        </div>
        <div />
      </div>

      <div className="container-fluid">
        <div
          ref={missionRef}
          className="row justify-content-center"
          id="mission"
        >
          <div className="col-md-10">
            <h1>Our Mission</h1>
            <h3>
              Offering individuals, organizations, and industries a path to
              attain <br /> their net-zero objectives.
            </h3>
            <p id="missiontext1">The problem: </p>
            <p id="missiontext2"> Timeline of carbon Emission impact</p>
            <div className="row justify-content-evenly" id="timeline1">
              <div className="col-md-2" id="div1">
                <p>Minimal emissions,natural CO2 balance</p>
              </div>
              <div className="col-md-2" id="div3">
                <p>Fossil fuels surge, climate impact surfaces</p>
              </div>
              <div className="col-md-2" id="div5">
                <p>
                  Proof of human-caused warming. Efforts to curb emissions begin
                </p>
              </div>
              <div className="col-md-2" id="div7">
                <p>
                  Shift to renewables, health implications. Urgency for change
                  mounts
                </p>
              </div>
            </div>
            <div className="row justify-content-evenly" id="serial">
              <div className="col-md-1" id="s2">
                <p>Late 18th to 19th Century</p>
              </div>
              <div className="col-md-1" id="s3">
                <p>20th Century</p>
              </div>
              <div className="col-md-1" id="s1">
                <p>Before 1800s</p>
              </div>
              <div className="col-md-1" id="s4">
                <p>Mid-20th Century</p>
              </div>
              <div className="col-md-1" id="s5">
                <p>Late 20th Century</p>
              </div>
              <div className="col-md-1" id="s6">
                <p>21th Century</p>
              </div>
              <div className="col-md-1" id="s7">
                <p>2020s</p>
              </div>
              <div className="col-md-1" id="s8">
                <p>Future</p>
              </div>
            </div>
            <div className="row justify-content-evenly" id="timeline2">
              <div className="col-md-2" id="div2">
                <p>
                  Industrialization spikes emissions. CO2 levels begin to rise
                </p>
              </div>
              <div className="col-md-2" id="div4">
                <p>Awareness grows, hints of consequence</p>
              </div>
              <div className="col-md-2" id="div6">
                <p>
                  CO2 climbs, extreme events intensity. Sea levels &
                  biodiversity at risk
                </p>
              </div>
              <div className="col-md-2" id="div8">
                <p>
                  Our choice: mitigate or endure.Act now to safeguard tomorrow
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* mission for small devices  */}
      <div className="container-fluid" id="mission2">
        <div className="row justify-content-evenly">
          <div className="col-md-3" id="serial2">
            <div id="btn1">
              <p>Before 1800s</p>
            </div>
            <div id="btn2">
              <p>Late 18th to 19th Century</p>
            </div>
            <div id="btn3">
              <p>20th Century</p>
            </div>
            <div id="btn4">
              <p>Mid-20th Century</p>
            </div>
            <div id="btn5">
              <p>Late 20th Century</p>
            </div>
            <div id="btn6">
              <p>21th Century</p>
            </div>
            <div id="btn7">
              <p>2000s</p>
            </div>
            <div id="btn8">
              <p>Future</p>
            </div>
          </div>
          <div className="col-md-7" id="content">
            <div id="content1">
              <p>Minimal emissions, natural CO2 balance</p>
            </div>
            <div id="content2">
              <p>
                Industrialization spikes emissions, CO2 levels begin to rise
              </p>
            </div>
            <div id="content3">
              <p>Fossil fuels surge, climate impact surfaces</p>
            </div>
            <div id="content4">
              <p>Awareness grows, hints of consequence</p>
            </div>
            <div id="content5">
              <p>
                Proof of human-caused warming. Effortsto curb emissions begin
              </p>
            </div>
            <div id="content6">
              <p>
                CO2 climbs, extreme events intensify. Sea levels and
                biodiversity at risk
              </p>
            </div>
            <div id="content7">
              <p>
                Shift to renewables, health implications. Urgency for change
                mounts
              </p>
            </div>
            <div id="content8">
              <p>
                Our choices: mitigate or andure. Act now to safeguard tomorrow
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid sticky-bottom ">
        <div className="row justify-content-evenly mt-2" id="footer">
          <div className="col-md-3 d-none d-md-block">
            <img
              src={logo}
              alt="Nothing"
              className="img-fluid"
              id="footerimg"
            />
          </div>
          <div className="col-md-6">
            <h3>WHAT IS SUSTAIN TRACK?</h3>
            <p>
              It's a carbon footprint analyser that helps you to reduce your
              carbon footprint based on your current lifestyle. <br /> Sustain
              Track enables users to measure their carbon emissions, provides
              personalized recommendations to lower them, and tracks progress
              over time.
            </p>
          </div>
          <div className="col-md-3">
            <h3>CONTACT US</h3>
            <a href="#">
              <IoIosMail /> info@example.com
            </a>
            <p>
              <FaPhone /> + 91 12345
            </p>
          </div>
        </div>
      </div>
      <Chatbot/>
    </div>
  );
}

export default Home;