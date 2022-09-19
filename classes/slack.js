import axios from 'axios'
import qs from 'querystring'

export const slack = {
    sendMessageTo
}

function sendMessageTo(infos, message){
    return new Promise((resolve, reject) => {
        axios.post('https://slack.com/api/chat.postMessage',qs.stringify({
                token: process.env.TOKENSLACK,
                text: ' ',
                channel: infos.channel,
                attachments: message,
                as_user: true
            }), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            }
        )
            .then(response => {
                resolve(response.data)
            })
            .catch((err) => {
                reject(err)
            })
    })
}