const mongoose = require("mongoose");
const Schema   = mongoose.Schema;
const User = require('./user');


const preferencesSchema = new Schema({
  degree: { type: String, required: true },
  sun: { type: Number, required: true },
  rain: { type: Number, required: true },
  clouds: { type: Number, required: true },
  snow: { type: Number, required: true },
  wind: { type: Number, required: true },
  idealTemp: { type: Number, required: true },
});

const Preferences = mongoose.model("Preferences", preferencesSchema);

module.exports = Preferences;
