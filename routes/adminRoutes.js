const express = require('express');
const router = express.Router();
const Admin = require('../models/AdminModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require("express-validator");

// Admin Login Route
router.post('/login', [
   check('username').isLength({ min: 1 }).withMessage('Username is required'),
   check('password').isLength({ min: 1 }).withMessage('Password is required'),
  ], async (req, res) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
   }
  
   try {
      const { username, password } = req.body;
  
      // Find the admin by username
      const admin = await Admin.findOne({ username });
      if (!admin) {
        return res.status(404).json({ message: 'Admin not found' });
      }
  
      // Check if the password matches
      // const isMatch = await bcrypt.compare(password, admin.password);
      if (!password) {
        return res.status(400).json({ message: 'Invalid password' });
      }
  
      // Generate a JWT token
      const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });
  
      // Send the token back to the client
      res.json({ token });
   } catch (err) {
      console.error('Error logging in admin:', err);
      res.status(500).json({ message: 'Server Error' });
   }
  });
  

// Route to add a new admin
router.post('/add', async (req, res) => {
 try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newAdmin = new Admin({
      username: req.body.username,
      password: hashedPassword
    });
    await newAdmin.save();
    res.status(201).json(newAdmin);
 } catch (err) {
    res.status(500).json({ message: 'Error adding admin' });
 }
});

// Route to change an admin's password
router.patch('/change-password/:id', async (req, res) => {
 try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    const isMatch = await bcrypt.compare(req.body.oldPassword, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect old password' });
    }

    const hashedNewPassword = await bcrypt.hash(req.body.newPassword, 10);
    admin.password = hashedNewPassword;
    await admin.save();
    res.json({ message: 'Password changed successfully' });
 } catch (err) {
    res.status(500).json({ message: 'Error changing password' });
 }
});

// Route to delete an admin
router.delete('/delete/:id', async (req, res) => {
 try {
    const admin = await Admin.findByIdAndDelete(req.params.id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.json({ message: 'Admin deleted successfully' });
 } catch (err) {
    res.status(500).json({ message: 'Error deleting admin' });
 }
});



module.exports = router;
