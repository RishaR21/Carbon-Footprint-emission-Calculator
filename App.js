import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CreateAccount from "./Authentication/createAcc";
import Login from "./Authentication/loginAcc";
import Dashboard from "./Authentication/Dashboard";
import Home from "./home/Home.js";
import Transport from "./Transportation.js";
import Waste from "./Waste.js";
import Energy from "./Energy.js";
import Electricity from "./Electricity.js";
import Diet from "./Diet.js";
import { AuthProvider } from "./Authentication/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/transport" element={<Transport />} />
          <Route path="/waste" element={<Waste />} />
          <Route path="/diet" element={<Diet />} />
          <Route path="/energy" element={<Energy />} />
          <Route path="/electricity" element={<Electricity />} />
          <Route path="/createAcc" element={<CreateAccount />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;