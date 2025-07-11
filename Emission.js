const mongoose = require("mongoose");

const EmissionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  category: { type: String, required: true },
  emissionValue: { type: Number, required: true },
  details: { type: Object, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Emission", EmissionSchema);