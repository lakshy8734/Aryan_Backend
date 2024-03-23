   // backend/routes/paymentRoutes.js
   const express = require('express');
   const router = express.Router();
   const Razorpay = require('razorpay');
   const crypto = require('crypto');
//    const config = require('../config');

   const client = new Razorpay({
     key_id: process.env.RAZORPAY_KEY_ID,
     key_secret: process.env.RAZORPAY_SECRET,
   });

   router.post('/order', async (req, res) => {
     try {
       const order = await client.orders.create(req.body);
       res.json(order);
     } catch (err) {
       console.log(err);
       res.status(500).send('Error');
     }
   });

   router.post('/order/validate', async (req, res) => {
     const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
     const sha = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET);
     sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
     const digest = sha.digest('hex');
     if (digest !== razorpay_signature) {
       return res.status(400).json({ msg: 'Transaction is not legit!' });
     }
     res.json({
       msg: 'success',
       orderId: razorpay_order_id,
       paymentId: razorpay_payment_id,
     });
   });

   module.exports = router;