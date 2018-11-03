const olxUrl = process.env.OLX_URL;
const otoDomUrl = process.env.OTO_DOM_URL;
const interval = process.env.SCRAP_INTERVAL || 10000;
const olxScrapper = require('./app/scrappers').olxScrapper;
const otoDomScapper = require('./app/scrappers').otoDomScrapper;

setTimeout(async () => {
    // await olxScrapper.readPage(olxUrl)
    await otoDomScapper.readPage(otoDomUrl)
});

setInterval(async () => {
    // await olxScrapper.readPage(olxUrl);
    await otoDomScapper.readPage(otoDomUrl);
}, interval);
