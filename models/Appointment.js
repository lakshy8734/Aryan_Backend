const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true},
  gender: { type: String, required: true },
  doctorId: { type: String, required: true, unique: false },
  date: { type: String, required: true },
  time: { type: String, required: true },
  phoneNo: { type: String, required: true },
  message: { type: String },
  department: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  isApproved: { type: Boolean, default: false  },
  isRescheduled: { type: Boolean, default: false  },
});

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;
