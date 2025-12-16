const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({
  _id: String,
  av: Number,
  username: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  sprint_40: Number,
  rank: String,
  tr: Number,
  last_updated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Player", playerSchema);