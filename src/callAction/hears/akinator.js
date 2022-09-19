let dotenv = require('dotenv').config();
const aki = require('@fahimbench/aki-api2');

module.exports = function (controller) {
  const region = process.env.AKINATOR_API;
  let users_action = new Array();
  let act;

  let confirm = (response) => {
    return {
      attachments: [{
        text: "Je pense que c'est \"" + response + "\" ... Est ce la bonne réponse ? :robot_face:",
        fallback: "message",
        callback_id: "akinator-win",
        actions: [ 
          {
            name: "oui",
            text: "Oui",
            value: "0",
            type: "button"
          },
          {
            name: "non",
            text: "Non",
            value: "1",
            type: "button"
          }
        ]
      }]
    }
  }
  let text = (question) => {
    return {
      attachments: [{
        text: question + "? :robot_face:",
        fallback: "Ne peut s'afficher",
        callback_id: "akinator-question",
        actions: [
          {
            name: "oui",
            text: "Oui",
            value: "0",
            type: "button"
          },
          {
            name: "non",
            text: "Non",
            value: "1",
            type: "button"
          },
          {
            name: "jenesaispas",
            text: "Je ne sais pas",
            value: "2",
            type: "button"
          },
          {
            name: "peutetre",
            text: "Peut-être",
            value: "3",
            type: "button"
          },
          {
            name: "peutetrepas",
            text: "Peut-être pas",
            value: "4",
            type: "button"
          }
        ]
      }]
    }
  }

  controller.hears(['^akinator$'], 'direct_message', function (bot, message) {
    let obj = {
      answerId: 0,
      step: 0,
      session: "",
      signature: "",
      ts: "",
      channel: "",
      try: []
    };
    if (!(message.user in users_action)) {
      users_action[message.user] = obj;
    } else {
      bot.api.chat.delete({
        ts: act.ts,
        channel: act.channel
      }, (err, res) => {
        if (err) {
          bot.botkit.log('Failed ', err);
        } else {
          users_action.splice(users_action.indexOf(message.user), 1);
        }
      });
      users_action[message.user] = obj;
    }

    act = users_action[message.user];

    aki.start(region, (gd, error) => {
      if (error) {
        bot.reply(message, 'une erreur est survenu, merci de réessayer plus tard :robot_face: 1' + error);
      } else {
        act.session = gd.session;
        act.signature = gd.signature;
        bot.reply(message, text(gd.question), (err, resp) => {
          act.ts = resp.ts;
          act.channel = resp.channel;
        });
      }
    });

  });

  controller.on('interactive_message_callback', (bot, message) => {
    act = users_action[message.user];
    switch (message.callback_id) {
      case 'akinator-question':

        act.answerId = message.actions[0].value;
        aki.step(region, act.session, act.signature, act.answerId, act.step, (next, error) => {
          if (error) {
            bot.replyInteractive(message, 'une erreur est survenu, merci de réessayer plus tard :robot_face: 2' + error);
          } else {
            if (next.progress >= 85) {
              aki.win(region, act.session, act.signature, act.step + 1, (resolve, error) => {
                if (error) {
                  bot.replyInteractive(message, 'une erreur est survenu, merci de réessayer plus tard :robot_face: 3' + error);
                } else {
                  if (!(resolve.answers[0].name in users_action[message.user].try)) {
                    users_action[message.user].try[resolve.answers[0].name] = resolve.answers[0].name;
                    bot.replyInteractive(message, confirm(resolve.answers[0].name));
                  } else {
                    act.step++;
                    bot.replyInteractive(message, text(next.nextQuestion));
                  }
                }
              });
            } else {
              act.step++;
              bot.replyInteractive(message, text(next.nextQuestion));
            }
          }
        });
        break;
      case 'akinator-win':
        if (message.actions[0].value == 1) {
          aki.back(region, act.session, act.signature, act.answerId, act.step - 1, (next, error) => {
            act.step++;
            bot.replyInteractive(message, text(next.nextQuestion));
          });

        } else {
          bot.replyInteractive(message, "AHAH ! super j'suis trop fort ! :robot_face:");
          delete users_action[message.user];
        }
        break;
      case 'akinator-stop':
          //Pour stopper akinator -> suppression de la fenetre ou remplace par un message 
      break;
    }
  });
}