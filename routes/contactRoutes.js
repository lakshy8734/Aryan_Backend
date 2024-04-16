const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const Contact = require("../models/ContactModel");

// POST route to save contact details
router.post(
 "/",
 [
    body("name")
      .notEmpty()
      .withMessage("Name is required")
      .matches(/^[a-zA-Z\s]+$/)
      .withMessage("Name can only contain letters and spaces"),
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid email format"),
    body("subject").notEmpty().withMessage("Subject is required"),
    body("message").notEmpty().withMessage("Message is required"),
 ],
 async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const contact = await Contact.create(req.body);
      res.status(201).json(contact);
    } catch (error) {
      console.error("Error saving contact:", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
 }
);

// GET route to fetch all contact details
router.get("/", async (req, res) => {
 try {
    const contacts = await Contact.find();
    res.status(200).json(contacts);
 } catch (error) {
    console.error("Error fetching contacts:", error.message);
    res.status(500).json({ error: "Internal server error" });
 }
});

module.exports = router;