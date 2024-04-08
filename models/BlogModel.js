// models/BlogModel.js
const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema(
 {
    title: {
      type: String,
      required: true,
    },
    detail: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    isActive: { type: Boolean, default: true },
    authorName: { // New field for author's name
      type: String,
      required: true,
    },
    time: { // New field for time
      type: String,
      required: true,
    },
 },
 { timestamps: true }
);

module.exports = mongoose.model("Blog", BlogSchema);