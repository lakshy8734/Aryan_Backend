// routes/doctorRoutes.js
const express = require("express");
const router = express.Router();
const Doctor = require("../models/DoctorModel");
const multer = require("multer");
const upload = require("../utils/multerConfig");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { check, validationResult } = require("express-validator");
const { v4: uuidv4 } = require("uuid");

router.post('/login', [
  check('doctorId').isLength({ min: 1 }).withMessage('Doctor ID is required'),
  check('password').isLength({ min: 1 }).withMessage('Password is required'),
 ], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
     return res.status(400).json({ errors: errors.array() });
  }
 
  try {
     const { doctorId, password } = req.body;
 
     // Find the doctor by doctorId
     const doctor = await Doctor.findOne({ doctorId });
     if (!doctor) {
       return res.status(404).json({ message: 'Doctor not found' });
     }
 
     // Check if the password matches
     const isMatch = await bcrypt.compare(password, doctor.password);
     if (!isMatch) {
       return res.status(400).json({ message: 'Invalid password' });
     }
 
     // Generate a JWT token
     const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET, {
       expiresIn: '1h',
     });
 
     // Send the token back to the client
     res.json({ token });
  } catch (err) {
     console.error('Error logging in doctor:', err);
     res.status(500).json({ message: 'Server Error' });
  }
 });

router.get("/", async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (err) {
    console.error("Error fetching doctors:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

router.post(
  "/",
  [
    upload.single("image"),
    check("name").notEmpty().withMessage("Name is required"),
    check("education").notEmpty().withMessage("Education is required"),
    check("department").notEmpty().withMessage("Department is required"),
    check("about").notEmpty().withMessage("About is required"),
    check("experience").notEmpty().withMessage("Experience is required"),
    check("password")
      .if(check("isAdmin").equals(true)) // Only check username if isAdmin is true
      .notEmpty()
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    check("username")
      .if(check("isAdmin").equals(true)) // Only check username if isAdmin is true
      .notEmpty()
      .withMessage("Username is required")
      .custom(async (username) => {
        const existingDoctor = await Doctor.findOne({ username });
        if (existingDoctor) {
          throw new Error("Username already exists");
        }
        return true;
      }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Generate a random doctorId
      const doctorId = uuidv4();

      // Hash the password
      let hashedPassword = null;
      if (req.body.isAdmin && req.body.password) {
        hashedPassword = await bcrypt.hash(req.body.password, 10);
      }

      const newDoctor = new Doctor({
        doctorId: doctorId,
        name: req.body.name,
        education: req.body.education,
        department: req.body.department,
        about: req.body.about,
        experience: req.body.experience,
        image: req.file.path,
        youtubeLink: req.body.youtubeLink,
        instagramLink: req.body.instagramLink,
        facebookLink: req.body.facebookLink,
        username: req.body.username,
        password: hashedPassword,
      });

      const savedDoctor = await newDoctor.save();
      res.status(201).json(savedDoctor);
    } catch (err) {
      console.error("Error adding doctor:", err);
      res.status(500).json({ message: "Server Error" });
    }
  }
);

router.get("/:doctorId", async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ doctorId: req.params.doctorId });
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    // Return the doctorId instead of the database _id
    res.json({ doctorId: doctor.doctorId, ...doctor._doc });
  } catch (err) {
    console.error("Error fetching doctor:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

router.delete("/:doctorId", async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ doctorId: req.params.doctorId });
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Construct the full path to the image file
    const imagePath = `${doctor.image.replace(/\\/g, "/")}`;
    console.log(imagePath);

    // Delete the image file from the file system
    fs.unlink(imagePath, async (err) => {
      if (err) {
        console.error("Error deleting image file:", err);
        return res.status(500).json({ message: "Error deleting image file" });
      }

      // If the image file is successfully deleted, proceed to delete the doctor from the database
      try {
        await Doctor.deleteOne({ doctorId: req.params.doctorId });
        res.status(200).json({
          message: "Doctor and image deleted successfully",
          doctorId: req.params.doctorId,
        });
      } catch (err) {
        console.error("Error deleting doctor:", err);
        res.status(500).json({ message: "Server Error" });
      }
    });
  } catch (err) {
    console.error("Error deleting doctor:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// routes/doctorRoutes.js
router.patch("/:doctorId/toggle-active", async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ doctorId: req.params.doctorId });
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    doctor.isActive = !doctor.isActive; // Toggle the isActive status
    await doctor.save();

    res.json({
      message: "Doctor's active status toggled successfully",
      doctorId: doctor.doctorId,
      isActive: doctor.isActive,
    });
  } catch (err) {
    console.error("Error toggling doctor's active status:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Add this route to your doctorRoutes.js
router.post("/login", async (req, res) => {
  try {
    const { doctorId, password } = req.body;

    // Find the doctor by doctorId
    const doctor = await Doctor.findOne({ doctorId });
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET, {
      expiresIn: "1m",
    });

    // Send the token back to the client
    res.json({ token });
  } catch (err) {
    console.error("Error logging in doctor:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
