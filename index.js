require = require('esm')(module)
module.exports = require("./src/app")

let dotenv = require('dotenv').config();
let botkit = require('botkit');
let app = require('./src/app');

let token = process.env.TOKENSLACK;

let controller = botkit.slackbot({
    debug: true,
    json_file_store: './db_slackbutton_bot/',
    interactive_replies: true
});

let bot = controller.spawn(
    {
        retry: true,
        token: token
    }
).startRTM();

app.start(controller, bot);

controller.setupWebserver(8080, function (err, webserver) {
    controller.createWebhookEndpoints(webserver);
});

















