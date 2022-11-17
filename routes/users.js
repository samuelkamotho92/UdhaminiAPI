const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
//GET all user
router.get("/all", async (req, res) => {
    try {
        const allUsers = await User.find();
        if (allUsers.length > 0) {
            const data = [];
            allUsers.map((user) => {
                data.push({
                    "_id": user._id,
                    "fullname": user.fullname,
                    "age": user.age,
                    "gender": user.gender,
                    "email": user.email,
                    "education_level": user.education_level,
                    "gpa": user.gpa,
                    "country": user.country,
                    "profilepic": user.profilepic,
                    "createdAt": user.createdAt,
                    "updatedAt": user.updatedAt,
                });
            })
            res.status(200).json(data);
        } else {
            res.status(200).json("no Users found");
        }
    } catch (err) {
        res.status(500).json(err);
    }
});
//UPDATE
router.put("/:id", async (req, res) => {
    if (req.body.userId == req.params.id) {
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
            req.body.password = hashedPassword;
        }
        try {
            const updatedUser = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            }, { new: true });
            const { password, ...others } = updatedUser._doc;
            res.status(200).json("User Update Successful");
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(401).json("Unauthorized:you can only update your account!");
    }
});
//DELETE
router.delete("/:id", async (req, res) => {
    const user = await User.findById(req.params.id); //check if the user exists via id   
    if (req.body.userId == req.params.id) {             
        if (user) {
            try {
                await User.findByIdAndDelete(req.params.id);   //we delete the user via id  
                res.status(200).json("User has been deleted!");
            } catch (err) {
                res.status(500).json(err);
            }
        } else {
            res.status(200).json("user not found!");
        }
    } else {
        res.status(401).json("Unauthorized:you can only delete on your account!");
    }
});
//GET USER
router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const { password, ...others } = user._doc;
        res.status(200).json(others);
    } catch (error) {
        res.status(500).json("user not found!");
    }
});
module.exports = router