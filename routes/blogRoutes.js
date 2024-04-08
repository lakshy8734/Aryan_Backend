// routes/blogRoutes.js
const express = require("express");
const router = express.Router();
const Blog = require("../models/BlogModel");
const multer = require('multer');
const upload = require("../utils/multerConfig");
const { body, validationResult } = require('express-validator');

const validateImage = (req, res, next) => {
   if (!req.file) {
      return res.status(400).json({ errors: [{ msg: "Image is required" }] });
   }
   // Add more validation checks here, e.g., file type, size
   // Example: Check if the file is an image
   if (!req.file.mimetype.startsWith('image/')) {
      return res.status(400).json({ errors: [{ msg: "File is not an image" }] });
   }
   // Example: Check if the file size is within a limit (e.g., 2MB)
   const maxSize = 2 * 1024 * 1024; // 2MB
   if (req.file.size > maxSize) {
      return res.status(400).json({ errors: [{ msg: "Image file is too large" }] });
   }
   next();
  };
  
  const validateBlog = [
   body('title').notEmpty().withMessage('Title is required'),
   body('detail').notEmpty().withMessage('Detail is required'),
   body('authorName').notEmpty().withMessage('Author Name is required'),
  ];
  
  router.post("/", upload.single('image'), validateBlog, validateImage, async (req, res) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
   }

 try {
    const newBlog = new Blog({
      title: req.body.title,
      detail: req.body.detail,
      image: req.file.path,
      date: Date.now(),
      authorName: req.body.authorName, // Include authorName
      time:  new Date().toISOString(), // Include time
    });

    const savedBlog = await newBlog.save();
    console.log(savedBlog);
    res.status(201).json(savedBlog);
 } catch (err) {
    console.error("Error adding blog:", err);
    res.status(500).json({ message: "Server Error" });
 }
});

router.get("/", async (req, res) => {
   try {
      const blogs = await Blog.find();
      res.json(blogs);
   } catch (err) {
      console.error("Error fetching blogs:", err);
      res.status(500).json({ message: "Server Error" });
   }
  });

router.get("/:id", async (req, res) => {
 try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.json(blog);
 } catch (err) {
    console.error("Error fetching blog:", err);
    res.status(500).json({ message: "Server Error" });
 }
});

router.patch("/:id/toggle-active", async (req, res) => {
 try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    blog.isActive = !blog.isActive; // Toggle the isActive status
    await blog.save();

    res.json({ message: "Blog's active status toggled successfully", blog });
 } catch (err) {
    console.error("Error toggling blog's active status:", err);
    res.status(500).json({ message: "Server Error" });
 }
});

// Add more routes for updating and deleting blogs as needed

module.exports = router;