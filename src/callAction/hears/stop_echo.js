module.exports = function (controller) {
    controller.hears('.*', 'message_received', function (bot, message) {
        if (message.user === bot.identity.id){
            return false;
        }
    });
}