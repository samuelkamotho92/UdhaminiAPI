const router = require('express').Router();
const User = require('../models/User');
const Admin = require('../models/Admin');
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
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