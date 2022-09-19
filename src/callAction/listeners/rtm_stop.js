module.exports = (controller) => {
    controller.on('rtm_close', function (bot, err) {
        bot.startRTM();
    })
}