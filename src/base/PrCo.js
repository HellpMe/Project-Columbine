const { Client, Collection } = require('discord.js'),
    { GuildSchema } = require('../database/models');

module.exports = class PrCo extends Client {
    constructor(options) {
        super(options);
        //comand handler
        this.aliases = new Collection();
        this.commands = new Collection();
        this.cooldowns = new Collection();

        //Iniciando a database1
        this.mongoose = require('../database/mongoose');
        //Iniciando a database2
        this.firebase = require('../database/firebase');

        //Arquivo config.js
        this.config = require('../config/config')
        this.webhooks = require('../config/webhooks')

        //Para as traduções do client
		this.languages = require('../languages/language-meta.json');

        //Atividade do bot
        this.Activity = [];
        this.PresenceType = 'PLAYING';
          
        //Estatisticas basica do bot
        this.messagesSent = 0;
        this.commandsUsed = 0;
    }
        //Quando bot entrar um servidor adicionar as configs
        async CreateGuild(settings) {
            try {
                const newGuild = new GuildSchema(settings);
                return await newGuild.save();
            } catch (err) {
                if (this.config.debug) console.log(err.message);
                return false;
            }
        }
        // Apagando as configs caso remova o bot
        async DeleteGuild(guild) {
		try {
			await GuildSchema.findOneAndRemove({ guildID: guild.id });
			return true;
		} catch (err) {
			if (this.config.debug) console.log(err.message);
			return false;
		}
	}
        //Setando a atividade do bot
        SetActivity(array = [], type = 'STREAMING') {
            this.Activity = array;
            this.PresenceType = type;
            try {
                let j = 0;
                setInterval(() => this.user.setActivity(`${this.Activity[j++ % this.Activity.length]}`, { type: type }), 10000);
                return;
            } catch (e) {
                console.log(e);
            }
        }
	//Enviar a tradução para o comando usado
	translate(key, args, locale) {
		if (!locale) locale = this.config.defaultSettings.Language;
		const language = this.translations.get(locale);
		if (!language) throw 'Linguagem enviada invalida!';
		return language(key, args);
	}
}