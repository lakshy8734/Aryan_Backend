// models/DoctorModel.js
const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    doctorId: { type: String, required: true, unique: true }, // New field
    name: { type: String, required: true, unique: true },
    education: { type: String },
    department: { type: String },
    about: { type: String },
    experience: { type: String },
    image: { type: String },
    youtubeLink: { type: String },
    instagramLink: { type: String },
    facebookLink: { type: String },
    isActive: { type: Boolean, default: true },
    username: { type: String, unique: true },
    password: { type: String },
  },
  { timestamps: true }
);

const Doctor = mongoose.model("Doctor", doctorSchema);

module.exports = Doctor;
