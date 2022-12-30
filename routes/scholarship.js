const router = require('express').Router();
const Scholarship = require('../models/Scholarship');
const Admin = require('../models/Admin');
const User = require('../models/User');
const { verifyTokenAndPremiumTier, verifyTokenAndAdmin } = require("./verifyToken");

//User Tasks

//GET premium scholarships [done]
router.post("/premium", verifyTokenAndPremiumTier, async (req, res) => {
    try {
        const premiumScholarships = await Scholarship.find({ premium_tier: true });
        if (premiumScholarships.length > 0) {
            res.status(200).json(premiumScholarships);
        } else {
            res.status(200).json("no Premium Scholarships found");
        }
    } catch (err) {
        res.status(500).json(err);
    }
});
// get non premium scholarships [done]
router.get("/nonPremium", async (req, res) => {
    try {
        const premiumScholarships = await Scholarship.find({ premium_tier: false });
        if (premiumScholarships.length > 0) {
            res.status(200).json(premiumScholarships);
        } else {
            res.status(200).json("No NonPremium Scholarships found");
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

//Admin Tasks
//Create [done]
router.post('/adminRegister', verifyTokenAndAdmin, async (req, res) => {
    const newScholarship = new Scholarship(req.body);
    try {
        const savedScholarship = await newScholarship.save();
        res.status(200).json(savedScholarship);
    } catch (err) {
        res.status(500).json(err);
    }
});
//UPDATE [done]
router.put("/adminUpdate", verifyTokenAndAdmin, async (req, res) => {
    const ScholarshipExist = await Scholarship.findById(req.body.id); //check if the scholarship exists via id
    if (ScholarshipExist) {
        try {
            const updatedScholarship = await Scholarship.findByIdAndUpdate(req.body.id, {
                $set: req.body,
            }, { new: true });
            res.status(200).json(updatedScholarship);
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(404).json("scholarship doesnt exist!");
    }
});

//DELETE [done]
router.delete("/adminDelete", verifyTokenAndAdmin, async (req, res) => {
    const ScolarshipExist = await Scholarship.findById(req.body.id); //check if the scholarship exists via id
    if (ScolarshipExist) {
        try {
            await Scholarship.findByIdAndDelete(req.body.id);    //we delete the user via id        
            res.status(200).json("scholarship has been deleted!");
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(404).json("scholarship doesnt exist!");
    }
});
//GET all scholarship
router.get("/adminAll", verifyTokenAndAdmin, async (req, res) => {
    try {
        const allScholarships = await Scholarship.find();
        if (allScholarships.length > 0) {
            res.status(200).json(allScholarships);
        } else {
            res.status(200).json("no scholarships found");
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

//GET premium [done]
router.get("/adminPremium", verifyTokenAndAdmin, async (req, res) => {
    try {
        const premiumScholarships = await Scholarship.find({ premium_tier: true });
        if (premiumScholarships.length > 0) {
            res.status(200).json(premiumScholarships);
        } else {
            res.status(200).json("no Premium Scholarships found");
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

//GET One Scholarship
router.get("/adminOne", verifyTokenAndAdmin, async (req, res) => {
    try {
        const ScolarshipExist = await Scholarship.findById(req.body.id);
        if (ScolarshipExist) {
            res.status(200).json(ScolarshipExist);
        } else {
            res.status(404).json("scholarship doesnt exist!");
        }
    } catch (error) {
        res.status(500).json(error);
    }
});
module.exports = router