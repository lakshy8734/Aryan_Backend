const express = require('express');
const router = express.Router();
const Credentials = require('../models/CredentialsModel'); // Adjust the path as necessary
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');

// Middleware for validating the request body
const validateCredentials = [
 body('username').notEmpty().withMessage('Username is required'),
 body('password').notEmpty().withMessage('Password is required'),
];

router.post('/', validateCredentials, async (req, res) => {
 const errors = validationResult(req);
 if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
 }

 try {
    const { username, password } = req.body;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newCredentials = new Credentials({
      username,
      password: hashedPassword, // Store the hashed password
      type: 2, // Manually set type to 2
    });

    const savedCredentials = await newCredentials.save();
    res.status(201).json(savedCredentials);
 } catch (error) {
    console.error('Error saving credentials:', error.message);
    res.status(500).json({ error: 'Internal server error' });
 }
});

module.exports = router;