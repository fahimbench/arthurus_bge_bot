const axios = require('axios')

export const auth = {
    login
}

function login(username, password){
    return new Promise((resolve, reject) => {
        axios
            .post(process.env.ARTHUR_API+'/login_check',
                {
                    username: username,
                    password: password
                })
            .then(response => {
                resolve(response.data)
            })
            .catch((err) => {
                reject(err)
            })
    })
}