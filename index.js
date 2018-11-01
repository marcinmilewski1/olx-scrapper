const fetch = require('node-fetch');
const cheerio = require('cheerio');

const {WebClient} = require('@slack/client');
const token = process.env.SLACK_TOKEN;
const conversationId = process.env.SLACK_CONVERSATION_ID;
const web = new WebClient(token);

const olxUrl = process.env.OLX_URL;
const interval = process.env.SCRAP_INTERVAL || 10000;


var olxScrapper = (function () {
    const previousIds = new Set();

    return {
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
        },
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
            sendNotification(`${firstOffer.name} ${firstOffer.price}`, firstOffer.location, firstOffer.url);
            previousIds.add(firstOffer.id)
        }
    };
})();

function sendNotification(title, message, url) {
    console.log(`Sending a notification: {title: '${title}', message: '${message}}'`);
    sendToSlack(title, message, url)
}

function sendToSlack(title, message, url) {
    console.log(`Sending a slack message: {title: '${title}', message: '${message}}'`);
    web.chat.postMessage(
        {
            channel: conversationId,
            attachments: [
                {
                    "color": "#2e51a6",
                    "title": title,
                    "title_link": url,
                    "text": message,
                }
            ]
        })
        .then((res) => {
            // `res` contains information about the posted message
            console.log('Message sent: ', res.ts);
        })
        .catch(console.error);
}


function getTime() {
    return new Date(Date.now()).toLocaleString().split(' ')[1]
}

setTimeout(async () => {
    await olxScrapper.readPage(olxUrl)
});

setInterval(async () => {
    await olxScrapper.readPage(olxUrl);
}, interval);
