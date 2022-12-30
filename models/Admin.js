const mongoose = require('mongoose');
const AdminSchema = new mongoose.Schema({
    isAdmin: {
        type: Boolean,
        default: true,
    },
    fullname: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    country: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    profilepic: {
        type: String,
        default: '',
    },
},
    { timestamps: true }
);

module.exports = mongoose.model('Admin', AdminSchema);