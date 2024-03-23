const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  gender: { type: String, required: true },
  doctorName: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  phoneNo: { type: String, required: true },
  message: { type: String },
  department: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  isApproved: { type: Boolean },
});

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;
