const olxUrl = process.env.OLX_URL;
const interval = process.env.SCRAP_INTERVAL || 10000;
const olxScrapper = require('./app/scrappers').olxScrapper;


setTimeout(async () => {
    await olxScrapper.readPage(olxUrl)
});

setInterval(async () => {
    await olxScrapper.readPage(olxUrl);
}, interval);
