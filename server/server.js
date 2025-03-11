const express = require("express");
const cors = require("cors");
const connectDB = require("./config");
const taskRoutes = require("./routes/tasks");
const userRoutes = require("./routes/users");
require("dotenv").config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));