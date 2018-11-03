const olxUrl = process.env.OLX_URL;
const otoDomUrl = process.env.OTO_DOM_URL;
const interval = process.env.SCRAP_INTERVAL || 10000;
const olxScrapper = require('./app/scrappers').olxScrapper;
const otoDomScapper = require('./app/scrappers').otoDomScrapper;

setTimeout(async () => {
    if (olxUrl) {
        await olxScrapper.readPage(olxUrl);
    }
    else {
        console.log("No olx url");
    }

    if (otoDomUrl) {
        await otoDomScapper.readPage(otoDomUrl)
    }
    else {
        console.log("No otodom url");
    }
});

setInterval(async () => {
    if (olxUrl) {
        await olxScrapper.readPage(olxUrl);
    }
    else {
        console.log("No olx url");
    }

    if (otoDomUrl) {
        await otoDomScapper.readPage(otoDomUrl)
    }
    else {
        console.log("No otodom url");
    }
}, interval);
