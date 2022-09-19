module.exports = function (controller) {
    controller.hears('questionne moi', 'direct_message', function (bot, message) {
        let resp1 = function(themes){
            return {
                attachments: [
                    {
                        text: "Oh ! Super jouons ! Sur quel thème veux tu que je t\'interroge ?",
                        fallback: "Choisissez un thème pour être interrogé !",
                        callback_id: "game_selection",
                        actions: [
                            {
                                name: "themes",
                                text: "Selectionner un thème",
                                type: "select",
                                options: [
                                    {
                                        value: "blabla",
                                        text: "blabla"
                                    }
                                ]
                            }]
                    }
                ]
            }

        }
        bot.reply(message, resp1())
    })
}