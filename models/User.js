const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
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
    education_level: {
        type: String,
        required: true,
    },
    gpa: {
        type: Number,
        required: true,
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
    photo: {
        type: String,
        default: 'mypic',
    },
    premium_tier_available: {
        type: Boolean,
        default: false,
    }
},
    { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);