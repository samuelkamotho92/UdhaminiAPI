const router = require('express').Router();
const Admin = require('../models/Admin');
const User = require('../models/User');
const { verifyToken, verifyTokenAndAuthorization } = require("./verifyToken");
const CryptoJS = require("crypto-js");


//GET all users [done]
router.get("/allUsers", verifyToken, async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json(err);
    }
});

//GET all admins [done]
router.get("/allAdmins", verifyToken, async (req, res) => {
    try {
        const admins = await Admin.find();
        res.status(200).json(admins);
    } catch (err) {
        res.status(500).json(err);
    }
});

//GET USER [done]
router.get("/oneAdmin/:id", verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const { password, ...others } = user._doc;
        res.status(200).json(others);
    } catch (error) {
        res.status(500).json("user not found!");
    }
});
module.exports = router

// REGISTER ADMIN [done]
router.post('/register', async (req, res) => {
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

//UPDATE [done]
router.put("/update/:id", verifyTokenAndAuthorization, async (req, res) => {
    if (req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(
            req.body.password,
            process.env.PASS_SEC
        ).toString();
    }
    try {
        const updatedAdmin = await Admin.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
        );
        res.status(200).json(updatedAdmin);
    } catch (err) {
        res.status(500).json(err);
    }


});
//DELETE ADMIN [done]
router.delete("/delete/:id", verifyTokenAndAuthorization, async (req, res) => {
    const admin = await Admin.findById(req.params.id); //check if the user exists via id  
    if (admin) {
        try {
            await Admin.findByIdAndDelete(req.params.id);   //we delete the user via id  
            res.status(200).json("Admin has been deleted!");
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(200).json("Admin not found!");
    }
});

router.delete("/deleteUser/:id", verifyToken, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("User has been deleted...");
    } catch (err) {
        res.status(500).json(err);
    }
});
