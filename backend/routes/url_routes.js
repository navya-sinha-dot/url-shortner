const express = require("express");
const router = express.Router();
const { generateshorturl, redirectURL, urlanalytics } = require("../controller/urlcontroller.js");

router.post("/", generateshorturl);
router.get("/test", (req, res) => {
    res.send("test");
});
router.get("/analytics/:shortId", urlanalytics);
router.get("/:shortId", redirectURL);


module.exports = router;