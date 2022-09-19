import { nikoniko } from '../../../classes/nikoniko'
import { auth } from '../../../classes/auth'

module.exports = (controller) => {
    controller.on('interactive_message_callback', (bot, message) => {
        console.log(message.actions[0].value)
        const swap = message.callback_id.split('_');
        switch (swap[0]) {
            case "fell":
                auth.login(process.env.ARTHUR_API_USR, process.env.ARTHUR_API_PWD)
                    .then(success1 => {
                        nikoniko.createNikoNikoDataResult(success1.token, swap[1], message.actions[0].value).then(
                            success => {
                                bot.replyInteractive(message,
                                    {
                                        text: "Merci <@"+ message.user +"> d'avoir répondu avec sincérité ! Sachez que vos réponses à mes questions sont stockés anonymement et permettent d'améliorer nos services. :robot_face:"
                                    });
                            }
                        )
                    });

                break;
        }
    });


} 