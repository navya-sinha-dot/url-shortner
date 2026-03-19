const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const urlRouter = require("./routes/url_routes");
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, please try again after 15 minutes",
    skip: (req) => {
        return req.method === "GET" && req.path.match(/^\/url\/[^/]+$/) && !req.path.includes("test");
    }
});

dotenv.config();

const app = express();

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());
app.use(limiter)

const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL;

async function startServer() {
    try {

        await mongoose.connect(MONGO_URL);
        console.log("Database connected");

        app.use("/url", urlRouter);

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });

    } catch (error) {
        console.error("Database connection failed:", error);
    }
}

startServer();