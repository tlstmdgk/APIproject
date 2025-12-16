const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  sprint_40: Number,
  tetra_league: String,
  last_updated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Player", playerSchema);