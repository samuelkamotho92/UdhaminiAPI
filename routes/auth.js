const router = require('express').Router();
const User = require('../models/User');
const Admin = require('../models/Admin');
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");

//REGISTER USER
router.post('/userRegister', async (req, res) => {
    // res.status(200).json({ message: "Register" });
    try {
        const existingUser = await User.findOne({ username: req.body.username });
        if (!existingUser) {
            const existingEmail = await User.findOne({ email: req.body.email });
            if (!existingEmail) {
                const newUser = new User({
                    fullname: req.body.fullname,
                    age: req.body.age,
                    gender: req.body.gender,
                    education_level: req.body.education_level,
                    gpa: req.body.gpa,
                    country: req.body.country,
                    profilepic: req.body.profilepic,
                    username: req.body.username,
                    email: req.body.email,
                    password: CryptoJS.AES.encrypt(
                        req.body.password,
                        process.env.PASS_SEC
                    ).toString(),
                });
                try {
                    const savedUser = await newUser.save();
                    const { password, ...others } = savedUser._doc;
                    res.status(200).json(others);
                } catch (error) {
                    res.status(500).json(err);
                }
            } else {
                return res.status(401).send("Email already taken");
            }
        } else {
            return res.status(401).send("Username already taken");
        }
    } catch (err) {
        res.status(500).send("Server error");
    };
});

//REGISTER ADMIN
router.post('/adminRegister', async (req, res) => {
    try {
        const existingAdmin = await Admin.findOne({ username: req.body.username });
        if (!existingAdmin) {
            const existingEmail = await Admin.findOne({ email: req.body.email });
            if (!existingEmail) {
                const newAdmin = new Admin({
                    fullname: req.body.fullname,
                    age: req.body.age,
                    gender: req.body.gender,
                    isAdmin: req.body.isAdmin,
                    country: req.body.country,
                    profilepic: req.body.profilepic,
                    username: req.body.username,
                    email: req.body.email,
                    password: CryptoJS.AES.encrypt(
                        req.body.password,
                        process.env.PASS_SEC
                    ).toString(),
                });
                try {
                    const savedAdmin = await newAdmin.save();
                    const { password, ...others } = savedAdmin._doc;
                    res.status(200).json(others);
                } catch (error) {
                    res.status(500).json(err);
                }
            } else {
                return res.status(401).send("Email already taken");
            }
        } else {
            return res.status(401).send("Username already taken");
        }
    } catch (err) {
        res.status(500).send("Server error");
    };
});

//LOGIN USER
router.post('/userLogin', async (req, res) => {

    const user = await User.findOne({ username: req.body.username });
    if (user) {
        try {
            const hashedPassword = CryptoJS.AES.decrypt(
                user.password,
                process.env.PASS_SEC
            );
            const OriginalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
            if (OriginalPassword !== req.body.password) {
                res.status(401).json("Wrong credentials!");
            } else {
                const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SEC, { expiresIn: "3d" });
                const { password, ...others } = user._doc;
                res.status(200).json({ ...others, accessToken });
            }
        } catch (error) {
            res.status(500).json(error);
        }
    } else {
        res.status(401).json("Wrong credentials!");
    }


});

//LOGIN ADMIN
router.post('/adminLogin', async (req, res) => {
    try {
        const admin = await Admin.findOne({ username: req.body.username });
        if (admin) {
            const hashedPassword = CryptoJS.AES.decrypt(
                admin.password,
                process.env.PASS_SEC
            );
            const OriginalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
            OriginalPassword !== req.body.password && res.status(401).json("Wrong credentials!");

            const accessToken = jwt.sign({ id: admin._id }, process.env.JWT_SEC, { expiresIn: "3d" });
            const { password, ...others } = admin._doc;
            res.status(200).json({ ...others, accessToken });
        } else {
            res.status(401).json("Wrong credentials!");
        }
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router