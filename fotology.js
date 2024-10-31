const fotology = require("fotology");
let options = {
    size: "small", // large images only
    language: "en", // English
    safe: true, // force safe search on
    limit: 1 // Limit to 1 image
}

fotology("cats", options).then();