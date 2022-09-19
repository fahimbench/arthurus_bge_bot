import axios from 'axios'

export const nikoniko = {
    getAllGroups,
    createNikoNikoData,
    createNikoNikoDataResult
}

function getAllGroups(token){
    return new Promise((resolve, reject) => {
        axios
            .get(process.env.ARTHUR_API+'/api/niko_niko_groups', {
                headers: {
                    authorization: 'Bearer '+ token
                }
            })
            .then(response => {
                resolve(response.data)
            })
            .catch((err) => {
                reject(err)
            })
    })
}

function createNikoNikoData(token, id) {
    return new Promise((resolve, reject) => {
        axios
            .post(process.env.ARTHUR_API + '/api/niko_niko_datas', {
                nikonikogroups: "/api/niko_niko_groups/" + id
            }, {
                headers: {
                    authorization: 'Bearer ' + token
                }
            })
            .then(response => {
                resolve(response.data)
            })
            .catch((err) => {
                console.log(err)
                reject(err)
            })
    })
}
    function createNikoNikoDataResult(token, id, score) {
        return new Promise((resolve, reject) => {
            axios
                .post(process.env.ARTHUR_API + '/api/niko_niko_data_results', {
                    nikoNikoData: "/api/niko_niko_datas/" + id,
                    score: parseInt(score)
                }, {
                    headers: {
                        authorization: 'Bearer ' + token
                    }
                })
                .then(response => {
                    resolve(response.data)
                })
                .catch((err) => {
                    console.log(err)
                    reject(err)
                })
        })
}