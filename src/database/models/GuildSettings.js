const { Schema, model } = require('mongoose');

const guildSchema = Schema({
    //Armazenando nome e id do servidor/prefixo
	guildID: String,
	guildName: String,
    prefix: { type: String, default: '!' },
    //Premium Guilds
    isPremium: { type: String, default: false},
    Premium: {
        redeemedBy: {
            id: {type: String, default: null},
            tag: {type: String, default: null},
        },      
  redeemedAt: { type: String, default: null },
  expiresAt: { type: String, default: null },
  plan: { type: String, default: null },
    },
    leaves: { type: Array, default: [] },
    //DJ Roles
    MusicDJ: { type: Boolean, default: false },
	MusicDJRole: { type: String, default: '00' },
    //Infos basicas
    Language: { type: String, default: 'pt-BR' },
    version: { type: Number, default: '1.1' },

});
module.exports = model('Guild', guildSchema);