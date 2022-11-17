const router = require('express').Router();
const Scholarship = require('../models/Scholarship');
//Create
router.post('/register', async (req, res) => {
    const newScolarship = new Scholarship(req.body);
    try {
        const savedScholarship = await newScolarship.save();
        res.status(200).json(savedScholarship);
    } catch (err) {
        res.status(500).json(err);
    }
});
//UPDATE
router.put("/:id", async (req, res) => {
    const ScolarshipExist = await Scholarship.findById(req.params.id); //check if the scholarship exists via id
    if (ScolarshipExist) {
        try {
            const updatedScolarship = await Scholarship.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            }, { new: true });
            res.status(200).json(updatedScolarship);
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(404).json("scholarship doesnt exist!");
    }
});

//DELETE
router.delete("/:id", async (req, res) => {
    const ScolarshipExist = await Scholarship.findById(req.params.id); //check if the scholarship exists via id
    if (ScolarshipExist) {
        try {
            await Scholarship.findByIdAndDelete(req.params.id);    //we delete the user via id        
            res.status(200).json("scholarship has been deleted!");
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(404).json("scholarship doesnt exist!");
    }
});
//GET all scholarship
router.get("/all", async (req, res) => {
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

//GET One Scholarship
router.get("/:id", async (req, res) => {
    try {
        const ScolarshipExist = await Scholarship.findById(req.params.id);
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