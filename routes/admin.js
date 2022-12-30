const router = require('express').Router();
const Admin = require('../models/Admin');
const User = require('../models/User');
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");
const CryptoJS = require("crypto-js");


//GET all users [done]
router.post("/all", verifyToken, async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json(err);
    }
});

//UPDATE [done]
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
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
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
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
//GET USER [done]
router.post("/one", verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.body.id);
        const { password, ...others } = user._doc;
        res.status(200).json(others);
    } catch (error) {
        res.status(500).json("user not found!");
    }
});
module.exports = router