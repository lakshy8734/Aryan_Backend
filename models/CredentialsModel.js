const mongoose = require('mongoose');

const CredentialsSchema = new mongoose.Schema({
 username: {
    type: String,
    required: true,
    unique: true,
 },
 password: {
    type: String,
    required: true,
    unique: true,
 },
 type: {
    type: Number,
    required: true,
 },
});

module.exports = mongoose.model('Credentials', CredentialsSchema);