const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Route imports
const userRoutes = require("./routes/userRoutes");
const editProfileRoutes = require("./routes/editProfile");
const emissionRoutes = require("./routes/emissionRoutes");

const app = express();

// CORS configuration - Allow PUT and other methods
app.use(cors({
  origin: "http://localhost:3000",  // Allow your frontend to make requests
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],  // Allow necessary methods
  credentials: true,  // If you're using cookies or sessions
}));

app.use(express.json());

// MongoDB Connection
mongoose
  .connect("mongodb://127.0.0.1:27017/userDashboard", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Route usage
app.use("/api/users", userRoutes);
app.use("/api/users", editProfileRoutes);
app.use("/api/emissions", emissionRoutes);

// Start server
app.listen(8000, () => {
  console.log("🚀 Server running on port 8000");
});