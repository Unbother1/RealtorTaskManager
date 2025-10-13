const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "user", required: true},
    title: {type: String, required: true},
    dueDate: {type: Date, required: true},
    status: {type: String, enum: ["pending", "done"], default: "pending"}
});

module.exports = mongoose.model("Task", TaskSchema);