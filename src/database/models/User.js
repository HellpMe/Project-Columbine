const { Schema, model } = require('mongoose');

const userSchema = Schema({
//Armazenando os dados rsrs adição futura <3
discordID: { type: String, required: true, unique: true },
badges: { type: Array, default: [] },
lastVoted: { type: Number },
votes: { type: Number },

});
module.exports = model('User', userSchema);