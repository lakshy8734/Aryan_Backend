const express = require("express");
const router = express.Router();
const Credentials = require("../models/CredentialsModel"); // Adjust the path as necessary
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");

// Middleware for validating the request body
const validateCredentials = [
  body("username").notEmpty().withMessage("Username is required"),
  body("password").notEmpty().withMessage("Password is required"),
  body("type").isInt({ gt: 0 }).withMessage("Type must be a positive integer"), // Validate type
];

const validateLogin = [
  body("username").notEmpty().withMessage("Username is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

router.post("/", validateCredentials, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { username, password, type } = req.body; // Extract type from request body
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newCredentials = new Credentials({
      username,
      password: hashedPassword, // Store the hashed password
      type, // Use the type from the request body
    });

    const savedCredentials = await newCredentials.save();
    res.status(201).json(savedCredentials);
  } catch (error) {
    console.error("Error saving credentials:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Login route
router.post("/login", validateLogin, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { username, password } = req.body;

    // Find the credentials by username
    const credentials = await Credentials.findOne({ username });
    if (!credentials) {
      return res.status(404).json({ message: "Credentials not found" });
    }

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, credentials.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Check if the type is 1 before generating a token
    if (credentials.type === 1) {
      // Generate a JWT token
      const token = jwt.sign(
        { id: credentials._id, type: credentials.type },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h", // Token expiration time
        }
      );

      // Return the token and type associated with the credentials
      res.json({ token, type: credentials.type });
    } else {
      // If type is not 1, return the type without a token
      res.json({ type: credentials.type });
    }
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
