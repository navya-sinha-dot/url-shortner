const express = require("express");
const router = express.Router();
const { generateshorturl, redirectURL, urlanalytics } = require("../controller/urlcontroller.js");
const rateLimit = require("express-rate-limit");

const generateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
    message: "Too many URLs generated/analyzed from this IP, please try again after 15 minutes"
});

const redirectLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    message: "Too many redirect requests from this IP"
});

router.post("/", generateLimiter, generateshorturl);
router.get("/test", (req, res) => {
    res.send("test");
});
router.get("/analytics/:shortId", generateLimiter, urlanalytics);
router.get("/:shortId", redirectLimiter, redirectURL);


module.exports = router;