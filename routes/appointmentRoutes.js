const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Appointment = require('../models/Appointment');

// POST route to save appointment details
router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email format'),
    body('gender').notEmpty().withMessage('Gender is required'),
    body('doctorName').notEmpty().withMessage('Doctor name is required'),
    body('date').notEmpty().withMessage('Date is required'),
    body('time').notEmpty().withMessage('Time is required'),
    body('phoneNo').notEmpty().withMessage('Phone number is required'),
    body('department').notEmpty().withMessage('Department name is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const appointment = await Appointment.create(req.body);
      console.log(appointment);
      res.status(201).json(appointment);
    } catch (error) {
      console.error('Error saving appointment:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// GET route to fetch all appointment details
router.get('/', async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.status(200).json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Approve an appointment
router.patch('/:id/approve', async (req, res) => {
  try {
     const appointment = await Appointment.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
     res.status(200).json(appointment);
  } catch (error) {
     res.status(500).json({ error: 'Internal server error' });
  }
 });
 
 // Reject an appointment
 router.patch('/:id/reject', async (req, res) => {
  try {
     const appointment = await Appointment.findByIdAndUpdate(req.params.id, { isApproved: false }, { new: true });
     res.status(200).json(appointment);
  } catch (error) {
     res.status(500).json({ error: 'Internal server error' });
  }
 });

module.exports = router;
