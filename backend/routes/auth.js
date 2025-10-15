const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Task = require("../models/Task");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { error } = require("console");

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

//Register User and Auto Generate Tasks

router.post("/register", async(req, res) => {
    try {
        const {email, password} = req.body;

        //Prevent duplicate registration
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already registered. Please sign up with another email or login."});
        }

        // Hash password before saving

        //const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ email, password });
        await user.save();

        //Generate 30-day tasks

        const tasks = [];
        for (let i = 0; i < 30; i++) {
            const idea = contentIdeas[i % contentIdeas.length];
            const dueDate = new Date();
            dueDate.setDate(dueDate.getDate() +i);

            tasks.push({ userId: user._id, title: idea, dueDate });
        }
        await Task.insertMany(tasks);

        res.status(201).json({message: "User registered and tasks generated"})
    } catch (err) {
        res.status(400).json({error: err.message});
    }
});

//Login

router.post("/login", async (req, res) => {
    const {email, password} = req.body;
    try {
         const user = await User.findOne({email});
         
         if (!user) {
            return res.status(400).json({error: "User not found Please Signup"});
        }

        // Campare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid password"});
        }

        // Generate token

        const token = jwt.sign(
            { id: user._id, email:user.email }, process.env.JWT_SECRET, { expiresIn: "1d" }
        );
        
        res.json({token});
    } catch (err) {
        console.error("LOGIN ERROR:", err)
        res.status(500).json({ error: err.message})
    }
});

// Forgot Password
router.post("/forgot-password", async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404),json({ error: "User not found"});

        //Generate token
        const token = crypto.randomBytes(32).toString("hex");
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() = 3600000 //1hour
        await user.save();

        // send email with link
        const resetLink = `http://localhost:5173/reset-password${token}`;

        //Replace this with your real email credentials or mailtrap
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptoions = {
            to: user,email,
            from: process.env.EMAIL_USER,
            subject: "Password Reset Link",
            text: `You requested a password reset.\n\nClick the link below to reset your password:\n${resetLink}`,
        };

        await transporter.sendMail(mailOptions);
        res.json({ message: "Password reset link sent to your email" });
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
});

router.post("/reset-password:token", async (req, res) => {
    try {
        const user = await User.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() }, //token not expired
        });

        if (!user)
            return res.status(400).json({ error: "Invalid or expired token"});

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();
        res.json({ message: "Password has been reset successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

