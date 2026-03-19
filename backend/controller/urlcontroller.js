const URL = require("../models/urlmodel");
const encode = require("../utils/base62logic");
const { createClient } = require("redis");

const redisClient = createClient();
redisClient.on("error", (err) => console.error("Redis Client Error", err));
redisClient.connect().catch(console.error);

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

    //search karo in redis
    let cached = null;
    try {
        cached = await redisClient.get(shortId);
    } catch (err) {
        console.error("Redis GET error:", err);
    }

    if (cached) {
        URL.findOneAndUpdate(
            { shortId },
            {
                $push: {
                    visitHistory: { timestamp: Date.now() }
                }
            }
        ).catch(err => console.error("Error updating analytics on cache hit:", err));

        return res.redirect(cached);
    }

    //if not in redis then search in db and but it in cache
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

    try {
        await redisClient.set(shortId, entry.originalURL, {
            EX: 3600
        });
    } catch (err) {
        console.error("Redis SET error:", err);
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