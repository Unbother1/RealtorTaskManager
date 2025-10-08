const express = require("express");
const jwt = require ("jsonwebtoken");
const Task = require("../models/Task");
const router = express.Router();

//Middleware to Verify JWT

function authMiddleware(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Access denied. No token provided."});

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; //attach user info to request
        next();
    } catch (err) {
        res.status(400).json({ error: "invalid token"});
    }
}

//Get all tasks for logged-in user

router.get("/", authMiddleware, async (req, res) => {
    try {
        const tasks = (await Task.find({ userId: req.user.id})).sort({dueDate: 1});
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message});
    }
})

//Mark a task as done

router.put("/:id/done", authMiddleware, async (req, res) => {
    try {
        const task = await Task.findOneAndUpdate(
            {_id: req.params.id, userId: req.user.id },
            {status: "done" },
            {new: true}
        );
        if (!task) return res.status(404).json({ error: "Task not found"});
        res.json(task);
    } catch (err) {
        res.status(500).json({ error: err.message});
    }
})

//Add manual task
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { title, dueDate } = req.body;
        const task = new Task({
            userId: req.user.id,
            title,
            dueDate,
            status: "pending"
        });
        await task.save();
        res.status(201).json(task);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;