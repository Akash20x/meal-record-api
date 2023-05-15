const mongoose = require("mongoose");

const mealSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    name: {
      type: String,
    },
    time: {
      type: Date,
    },
    calories: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

mealSchema.index({ name: "text", userId: "text" });
module.exports = mongoose.model("Meal", mealSchema);

