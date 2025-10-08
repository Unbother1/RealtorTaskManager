const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Task = require("../model/Task");

const router = express.Router();

//Sample content Ideas

const contentIdeas = [
    "Post a new property listing",
    "Share a client testimonial",
    "Educational post about mortgages",
    "Market updates about for area",
    "Behind-the-scenes photo",
    "Neighborhood spotlight",
    "FAQ video answering buyer questions"
];

//Register

router.post("/register", async(req, res) => {
    try {
        const {email, password} = req.body;
        const user = new User({email, password});
        await user.save();

        //Generate 30-day tasks

        const tasks = [];
        for (let i=0; i<30; i++) {
            const idea = contentIdeas[1 % contentIdeas.length];
            const dueDate = new Date();
            dueDate.setDate(dueDate.getDate() +i);

            tasks.push({ userId: user._id, title: idea, dueDate });
        }
        await Task.insertMany(tasks);

        res.status(201).json({message: "User registered and tasks generated"})
    } catch (err) {
        res.status(400).json({error: err.message});
    }
})

//Login

router.post("/login", async (req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if (!user) return res.status(400).json({error: "Invalid Credentials"});

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "Id" });
    res.json({token});
});

module.exports = router;

