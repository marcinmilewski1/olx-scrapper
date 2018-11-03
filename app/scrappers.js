const fetch = require('node-fetch');
const cheerio = require('cheerio');
const common = require('./common').common;

var getTime = function () {
    return new Date(Date.now()).toLocaleString().split(' ')[1]
};

var olxScrapper = (function () {
    const previousIds = new Set();

    return {
        readPage: async function (url) {
            const response = await fetch(url);
            const text = await response.text();
            const $ = cheerio.load(text);

            let firstOffer;
            try {
                firstOffer = this.readOfferData($, 0);
                console.log(firstOffer);
                if (!firstOffer.id) {
                    throw Error(`Id is null ${firstOffer}`)
                }
            } catch (e) {
                console.error('Parsing template failed!', e);
                return
            }

            /* Program just started */
            if (previousIds.length === 0) {
                console.log(`${getTime()} Program Start!`);
                previousIds.add(firstOffer.id);
                return;
            }

            /* No new offer */
            if (previousIds.has(firstOffer.id)) {
                console.log(`${getTime()} [${firstOffer.name}#${firstOffer.id}] No new offer...`);
                return;
            }

            console.log(`${getTime()} New Offer!!! `, firstOffer);
            common.sendNotification(`${firstOffer.name} ${firstOffer.price}`, firstOffer.location, firstOffer.url);
            previousIds.add(firstOffer.id)
        },
        readOfferData: function ($, offerIndex) {
            const index = offerIndex + 3;
            return {
                name:
                    $(`#offers_table > tbody > tr:nth-child(${index}) > td > div > table > tbody > tr:nth-child(1) > td.title-cell > div > h3 > a > strong`)
                        .text(),
                price:
                    $(`#offers_table > tbody > tr:nth-child(${index}) > td > div > table > tbody > tr:nth-child(1) > td.wwnormal.tright.td-price > div > p > strong`)
                        .text(),
                location:
                    $(`#offers_table > tbody > tr:nth-child(${index}) > td > div > table > tbody > tr:nth-child(2) > td.bottom-cell > div > p > small:nth-child(1) > span`)
                        .text()
                        .trim(),
                url:
                    $(`#offers_table > tbody > tr:nth-child(${index}) > td > div > table > tbody > tr:nth-child(1) > td.title-cell > div > h3 > a`)
                        .attr('href'),
                id:
                    $(`#offers_table > tbody > tr:nth-child(${index}) > td > div > table`)
                        .attr('data-id')
            };
        }
    };
})();

var otoDomScrapper = (function () {
    const previousIds = new Set();

    return {
        readPage: async function (url) {
            const response = await fetch(url);
            const text = await response.text();
            const $ = cheerio.load(text);

            let firstOffer;
            try {
                firstOffer = this.readOfferData($, 0);
                console.log(firstOffer);
                if (!firstOffer.id) {
                    throw Error(`Id is null ${firstOffer}`)
                }
            } catch (e) {
                console.error('Parsing template failed!', e);
                return
            }

            /* Program just started */
            if (previousIds.length === 0) {
                console.log(`${getTime()} Program Start!`);
                previousIds.add(firstOffer.id);
                return;
            }

            /* No new offer */
            if (previousIds.has(firstOffer.id)) {
                console.log(`${getTime()} [${firstOffer.name}#${firstOffer.id}] No new offer...`);
                return;
            }

            console.log(`${getTime()} New Offer!!! `, firstOffer);
            common.sendNotification(`${firstOffer.name} (${firstOffer.area}) ${firstOffer.price} (${firstOffer.pricePerM})`, firstOffer.location, firstOffer.url);
            previousIds.add(firstOffer.id)
        },
        readOfferData: function ($, offerIndex) {

            allItemsDiv = $(`.listing-title:contains("Wszystkie ogłoszenia")`);
            item = allItemsDiv.nextAll($(`.offer-item`))[offerIndex];

            return {
                name: $(item).find('*').find('.offer-item-title').text().trim(),
                price: $(item).find('*').find(".offer-item-price").text().trim(),
                area: $(item).find('*').find(".offer-item-area").text().trim(),
                location: $(item).find('*').find('.offer-item-header').find('p').text().split(':').pop().trim(),
                pricePerM: $(item).find('*').find(".offer-item-area").text().trim(),
                id: item.attribs['data-tracking-id'],
                url: item.attribs['data-url']
            }
        }
    };

})();

module.exports = {
    olxScrapper: olxScrapper,
    otoDomScrapper: otoDomScrapper
};