const router = require('express').Router();
const Scholarship = require('../models/Scholarship');
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
        if (premiumScholarships) {
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
router.post('/register', verifyTokenAndAdmin, async (req, res) => {
    const newScholarship = new Scholarship(req.body);
    try {
        const savedScholarship = await newScholarship.save();
        res.status(200).json(savedScholarship);
    } catch (err) {
        res.status(500).json(err);
    }
});
//UPDATE [done]
router.put("/update", verifyTokenAndAdmin, async (req, res) => {
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
router.delete("/delete", verifyTokenAndAdmin, async (req, res) => {
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
router.get("/all", verifyTokenAndAdmin, async (req, res) => {
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
router.post("/onePremium", verifyTokenAndAdmin, async (req, res) => {
    try {
        const premiumScholarships = await Scholarship.find({
            premium_tier: true,
            _id: req.body.id
        });
        if (premiumScholarships.length > 0) {
            res.status(200).json(premiumScholarships);
        } else {
            res.status(200).json("no Premium Scholarships found");
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

//GET One nonPremiumScholarship [done]
router.post("/oneNonPremium", async (req, res) => {
    try {
        const nonPremiumScholarships = await Scholarship.find({
            premium_tier: false,
            _id: req.body.id
        });
        if (nonPremiumScholarships) {
            res.status(200).json(nonPremiumScholarships);
        } else {
            res.status(404).json("scholarship doesnt exist!");
        }
    } catch (error) {
        res.status(500).json(error);
    }
});
module.exports = router