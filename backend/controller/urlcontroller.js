const URL = require("../models/urlmodel");
const encode = require("../utils/base62logic");

async function generateshorturl(req, res) {
    const body = req.body;

    if (!body.url) {
        return res.status(400).json({ error: "URL required" });
    }

    // create entry
    const entry = await URL.create({
        originalURL: body.url,
        shortId: "temp"
    });

    // convert Mongo id to number
    const numericId = Date.now();
    console.log(numericId);
    const shortId = encode(numericId);
    console.log(shortId);

    entry.shortId = shortId;

    await entry.save();

    return res.json({
        shortId: shortId,
        shortURL: `https://urlbackend.navyasinha.xyz/url/${shortId}`
    });
}

async function redirectURL(req, res) {

    const shortId = req.params.shortId;

    const entry = await URL.findOneAndUpdate(
        { shortId },
        {
            $push: {
                visitHistory: {
                    timestamp: Date.now()
                }
            }
        }
    );

    if (!entry) {
        return res.status(404).send("URL not found");
    }

    res.redirect(entry.originalURL);
}

async function urlanalytics(req, res) {

    const shortId = req.params.shortId;

    const result = await URL.findOne({ shortId });

    if (!result) {
        return res.status(404).json({ message: "URL not found" });
    }

    return res.json({
        totalClicks: result.visitHistory.length,
        analytics: result.visitHistory
    });
}

module.exports = {
    generateshorturl,
    redirectURL,
    urlanalytics
};