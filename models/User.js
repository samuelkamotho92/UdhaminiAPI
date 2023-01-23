const mongoose = require('mongoose');
const validator = require('validator');
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
    passwordConfirm:{
        type:String,
        required:[true,'please enter password confirmation'],
        validate:{
            validator: function (pass) {
                return pass === this.password
            },
            message:'password does not match'
        }
    },
    profilepic: {
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