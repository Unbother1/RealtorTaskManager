const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

//Routes

const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/task");
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

//DB Connection
//console.log("Loaded MONGO_URI:", process.env.MONGO_URI ? "Found!" : "Missing!" )
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.error("DB Error:", err));

app.get("/", (req, res) => {
    res.send("Realtor Task Manager API is running");
});

//Start Server

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));