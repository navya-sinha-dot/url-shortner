const Base62 = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

function encode(num) {
    let shortId = "";
    while (num > 0) {
        const remainder = num % 62;
        shortId = Base62[remainder] + shortId;
        num = Math.floor(num / 62);
    }

    return shortId || "0";
}

module.exports = encode;