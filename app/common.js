const {WebClient} = require('@slack/client');
const token = process.env.SLACK_TOKEN;
const conversationId = process.env.SLACK_CONVERSATION_ID;

const web = new WebClient(token);

var common = (function () {

    const sendToSlack = function (title, message, url) {
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
    };

    return {
        sendNotification: function (title, message, url) {
            console.log(`Sending a notification: {title: '${title}', message: '${message}}'`);
            sendToSlack(title, message, url)
        },
    };
})();

module.exports = {
    common: common
};