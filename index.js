// index.js
const express = require("express");
const cors = require("cors");
// const compression = require("compression");
const path = require("path");
const connectDB = require("./db");
const appointmentRoutes = require("./routes/appointmentRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const blogRoutes = require("./routes/blogRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const adminRoutes = require("./routes/adminRoutes"); // Import the admin routes

// Load environment variables
require("dotenv").config();

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
// app.use(compression());

// Set up the cors middleware and specify the origin
app.use(
 cors({
    origin: process.env.FRONTEND_DOMAIN, // replace with your website's URL
 })
);

// Serve static files from the uploads/doctors and uploads/blogs directories
app.use(
 "/uploads/doctors",
 express.static(path.join(__dirname, "uploads/doctors"))
);
app.use(
 "/uploads/blogs",
 express.static(path.join(__dirname, "uploads/blogs"))
);

// Routes
app.use("/api/appointments", appointmentRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes); // Add the admin routes

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
 console.log(`Server running on port ${PORT}`);
});