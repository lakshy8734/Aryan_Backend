// models/DoctorModel.js
const mongoose = require("mongoose");

const timeSlotSchema = new mongoose.Schema({
   startTime: String,
   endTime: String,
   isAvailable: Boolean
  });
  

const doctorSchema = new mongoose.Schema(
 {
    doctorId: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: true },
    education: { type: String },
    department: { type: String },
    about: { type: String },
    experience: { type: String },
    fees: { type: Number },
   //  availableDates: [String], 
    image: { type: String },
    youtubeLink: { type: String },
    instagramLink: { type: String },
    facebookLink: { type: String },
    isActive: { type: Boolean, default: true },
    speciality: { type: String },
    timeSlots: [timeSlotSchema], // Add this line to include time slots
 },
 { timestamps: true }
);

const Doctor = mongoose.model("Doctor", doctorSchema);

module.exports = Doctor;