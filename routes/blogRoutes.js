// routes/blogRoutes.js
const express = require("express");
const router = express.Router();
const Blog = require("../models/BlogModel");
const multer = require('multer');
const upload = require("../utils/multerConfig");

router.get("/", async (req, res) => {
 try {
    const blogs = await Blog.find();
    res.json(blogs);
 } catch (err) {
    console.error("Error fetching blogs:", err);
    res.status(500).json({ message: "Server Error" });
 }
});

router.post("/", upload.single('image'), async (req, res) => {
 try {
    const newBlog = new Blog({
      title: req.body.title,
      detail: req.body.detail,
      image: req.file.path,
      date: Date.now(),
    });

    const savedBlog = await newBlog.save();
    res.status(201).json(savedBlog);
 } catch (err) {
    console.error("Error adding blog:", err);
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

 // routes/blogRoutes.js
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