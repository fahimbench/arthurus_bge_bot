module.exports = function(controller){
    controller.hears(['test'], 'direct_message, direct_mention, mention', function (bot, message) {
    bot.replyWithTyping(message, 'HELLO ça va bien ?');
    controller.storage.teams.save({
        id: message.team,
        bot: {
            user_id: bot.identity.id,
            name: bot.identity.name
        }
    }, (err, id) => {
        if (err) {
            throw new Error('ERROR: ' + err);
        }
    }); 
});
}