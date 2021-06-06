const { MessageEmbed } = require('discord.js');

module.exports = class EgglordEmbed extends MessageEmbed {
	constructor(client, guild, data = {}) {
		super(data);
		this.client = client;
		this.guild = guild;
		this.setColor('RANDOM')
			.setTimestamp();
	}

	// Language translator for title
	setTitle(key, args) {
		const language = this.guild?.settings.Language ?? this.client.config.defaultSettings.Language;
		this.title = this.client.translate(key, args, language) ? this.client.translate(key, args, language) : key;
		return this;
	}

	// Language translator for footer
	setFooter(key, args, icon) {
		if (typeof args === 'object') {
			const language = this.guild?.settings.Language ?? this.client.config.defaultSettings.Language;
			this.footer = {
				text: this.client.translate(key, args, language),
				iconURL: icon,
			};
		} else {
			this.footer = {
				text: key,
				iconURL: args,
			};
		}
		return this;
	}
};