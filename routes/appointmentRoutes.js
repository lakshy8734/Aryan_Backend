const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Appointment = require('../models/Appointment');
const nodemailer = require('nodemailer');

// POST route to send appointment confirmation email
router.post('/send-email', async (req, res) => {
  const { email, appointmentDetails, paymentLink } = req.body;

  try {
    // Create a transporter object using SMTP transport
    const transporter = nodemailer.createTransport({
      service:'gmail',
      host: 'smtp.gmail.com',
      port : 587,
      secure: false,
      auth: {
        user: process.env.USER, 
        pass: process.env.PASS, 
    
      },
    });

    // Send email
    await transporter.sendMail({
      from: {
        name: 'Weeb',
        address: process.env.USER
      },
      to: email,
      subject: 'Appointment Confirmation',
      html: `
        <p>Dear ${appointmentDetails.name},</p>
        <p>Your appointment has been scheduled successfully. Here are the details:</p>
        <p>Date: ${appointmentDetails.date}</p>
        <p>Time: ${appointmentDetails.time}</p>
        <p>Doctor: ${appointmentDetails.doctor}</p>
        <p>Department: ${appointmentDetails.department}</p>
        <p>Payment Link: <a href="${paymentLink}">${paymentLink}</a></p>
        <p>Thank you for choosing our services.</p>
      `,
    });

    res.status(200).json({ message: 'Confirmation email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error.message);
    res.status(500).json({ error: 'Failed to send confirmation email' });
  }
});

// POST route to save appointment details
router.post(
 '/',
 [
     body('name').notEmpty().withMessage('Name is required'),
     body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email format'),
     body('gender').notEmpty().withMessage('Gender is required'),
     // Removed 'doctorName' validation since we're now using 'doctorId'
     body('doctorId').notEmpty().withMessage('Doctor ID is required'),
     body('date').notEmpty().withMessage('Date is required'),
     body('time').notEmpty().withMessage('Time is required'),
     body('phoneNo').notEmpty().withMessage('Phone number is required'),
     body('department').notEmpty().withMessage('Department name is required'),
 ],
 async (req, res) => {
  // console.log(req.body); 
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

// New GET route to fetch only approved and active appointments
router.get('/approved-active', async (req, res) => {
  try {
     const appointments = await Appointment.find({ isApproved: true, isActive: true });
     res.status(200).json(appointments);
  } catch (error) {
     console.error('Error fetching approved and active appointments:', error.message);
     res.status(500).json({ error: 'Internal server error' });
  }
 });

 // New GET route to fetch only approved and active appointments for a specific profileId
router.get('/approved-active/:profileId', async (req, res) => {
  const { profileId } = req.params;
  try {
     const appointments = await Appointment.find({
       doctorId: profileId, // Assuming doctorId is used to store profileId
       isApproved: true,
       isActive: true
     });
     res.status(200).json(appointments);
  } catch (error) {
     console.error('Error fetching approved and active appointments:', error.message);
     res.status(500).json({ error: 'Internal server error' });
  }
 });

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

// Update appointment status (approve or reject)
router.patch('/:id/status', async (req, res) => {
  try {
     const { action } = req.body;
     let update = {};
 
     if (action === 'approve') {
       update = { isApproved: true };
     } else if (action === 'reject') {
       update = { isApproved: false };
     } else {
       return res.status(400).json({ error: 'Invalid action' });
     }
 
     const appointment = await Appointment.findByIdAndUpdate(req.params.id, update, { new: true });
     res.status(200).json(appointment);
  } catch (error) {
     console.error('Error updating appointment status:', error.message);
     res.status(500).json({ error: 'Internal server error' });
  }
 });

// GET route to fetch appointments by doctorId
router.get('/:doctorId', async (req, res) => {
 try {
      const appointments = await Appointment.find({ doctorId: req.params.doctorId });
      res.status(200).json(appointments);
 } catch (error) {
      console.error('Error fetching appointments by doctor ID:', error.message);
      res.status(500).json({ error: 'Internal server error' });
 }
});

module.exports = router;