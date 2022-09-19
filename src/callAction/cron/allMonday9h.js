import { auth } from '../../../classes/auth'
import { nikoniko } from '../../../classes/nikoniko'
import { slack } from '../../../classes/slack'

module.exports = {
  cronplan: "0 10 * * MON", //"0 10 * * MON"
  func: function(controller, bot) {

    function message(infos, id) {
      return JSON.stringify(
          [
            {
              text:
                  "Bonjour <@" +
                  infos.user +
                  "> ! Comment s’est déroulé votre semaine de formation ? :robot_face:",
              fallback: "Comment se passe votre formation ?",
              callback_id: "fell_"+id,
              actions: [
                {
                  name: "face1",
                  text: ":cry: très mal",
                  value: "-2",
                  type: "button"
                },
                {
                  name: "face2",
                  text: ":white_frowning_face: mal",
                  value: "-1",
                  type: "button"
                },
                {
                  name: "face3",
                  text: ":neutral_face: neutre",
                  value: "0",
                  type: "button"
                },
                {
                  name: "face4",
                  text: ":slightly_smiling_face: bien",
                  value: "1",
                  type: "button"
                },
                {
                  name: "face5",
                  text: ":grinning: très bien",
                  value: "2",
                  type: "button"
                }
              ]
            },
            {
              text: "",
              fallback: "Comment se passe votre formation ?",
              callback_id: "fell_"+id,
              actions: [
                {
                  name: "unknown",
                  text: "Je ne souhaite pas répondre",
                  value: "-1",
                  type: "button"
                }
              ]
            }
          ])
    }

    function timeoutMessage(a,b,c,d){
      setTimeout(
          () => {
            bot.api.chat.delete({
              token: process.env.TOKENSLACK,
              channel: d.channel,
              ts: d.ts
            }, (err, res) => {
              if(!err){
                auth.login(process.env.ARTHUR_API_USR, process.env.ARTHUR_API_PWD)
                    .then(success1 => {
                      let id = d.message.attachments[0].callback_id.split('_')[1];
                      nikoniko.createNikoNikoDataResult(success1.token, id, '')
                    })
              }
            })

          }, 259200000) //3days=259200000
    }

    auth.login(process.env.ARTHUR_API_USR, process.env.ARTHUR_API_PWD)
        .then(a => {
          nikoniko.getAllGroups(a.token).then(
              b => {
                b['hydra:member'].forEach(function(n){
                  nikoniko.createNikoNikoData(a.token, n.id).then(
                      c => {
                        n.nikoNikoUsers.forEach(function(m){
                          let infos = {user: m.idSlack, channel: m.idSlack}
                          slack.sendMessageTo(infos, message(infos, c.id)).then(
                              d => {
                                  timeoutMessage(a,b,c,d)
                              }
                          )
                        })
                      }
                  )
                })
              }
          )
        });
  }
}