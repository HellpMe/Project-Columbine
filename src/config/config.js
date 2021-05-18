const config = {
    ownerID: '583676051838861342', //Owner ID//Seu ID
    token: 'ODM4MjAyNzk4NjMzNTE3MTI3.YI3rMA.VPbpxdv093pc92HRkDK9DMSvm_U', //https://discord.com/developers/applications
    //Pegando as keys das API'S //GET_API_KEYS 
    api_keys: { //https://developer.spotify.com/dashboard/applications
        spotify: {
            iD: '5e76bb1f956c472b8fbef8108c04a222',
            secret: '74610f3484c5464589f8dbb6d9d3b27d'
        },
        genius: 'b7jTFhEmuIYuqsPFer_yzvuEU2zJmHrc0PhoXb4r45APGJJdhx8dWnIKwakH4F8e', //https://genius.com/api-clients
    },
    DiscordBotLists: {
        DBL_key: '',
    },
    //Support server ID/Channel 
    SupportServer: {
        serverID: '718853480097382430',
        serverChannel: '718853480097382435'
    },
    defaultSettings: {
        prefix: '!', //YouPrefix here
        Language: 'pt-Br',
        Dashboard: true,
    },
    //MongoDB URL
    MongoDBURl: 'mongodb+srv://PrCoJs:PrCo.Js@project-columbine.4tkrg.mongodb.net/PrCo?retryWrites=true&w=majority',
    //Para ajudar na correção de bugs!
    debug: false,
}
module.exports = config;