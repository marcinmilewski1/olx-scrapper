const WindowsToaster = require('node-notifier').WindowsToaster;
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const opn = require('opn');

const olxUrl = 'https://www.olx.pl/nieruchomosci/mieszkania/wynajem/bialystok/?search[filter_float_price:to]=1400&search[filter_enum_rooms][0]=one&search[filter_enum_rooms][1]=two';

let lastOffer = null;

async function readPage() {
  const response = await fetch(olxUrl);
  const text = await response.text();

  const $ = cheerio.load(text);

  let firstOffer;
  try {
    firstOffer = readOfferData($, 0);
  } catch (e) {
    console.error('Parsing template failed!', e);
    return
  }

  /* When lastOffer is null, it means the program just started */
  if (lastOffer == null) {
    console.log('Program Start!');
    lastOffer = firstOffer;
    return;
  }

  /* No new offer */
  if (firstOffer.id === lastOffer.id) {
    console.log('No new offer...');
    return;
  }

  console.log('New Offer!!!', firstOffer);
  sendNotification(`${firstOffer.name} ${firstOffer.offerPrice}`, firstOffer.location, firstOffer.url);
  lastOffer = firstOffer;
}

function readOfferData($, offerIndex) {
  const index = offerIndex + 2;
  const offer = {
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
  };
  offer.id = offer.url.split('#')[1];

  return offer;
}

function sendNotification(title, message, url) {
  const options = {
    title,
    message,
    sound: true,
    wait: true,
    type: 'info',
  };

  new WindowsToaster().notify(options, (error, response) => {
    console.log(response);
    opn(url);
  });
}

setTimeout(async () => {
  await readPage()
});

setInterval(async () => {
  await readPage();
}, 5000);

// sendNotification("Foo", "bar", "http://tibia.com/");