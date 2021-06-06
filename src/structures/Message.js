// Dependecies
const { Structures } = require('discord.js'),
	sm = require('string-similarity');

module.exports = Structures.extend('Message', Message => {
	class CustomMessage extends Message {
		constructor(client, data, channel) {
			super(client, data, channel);
			// Isso para armazenar em cache as configurações do servidor
			this.args = [];
		}

		// ser usado principalmente para obter mensagens e, em seguida, obter os argumentos delas
		getArgs() {
			const args = this.content.split(' ');
			args.shift();
			if (this.content.startsWith(`<@!${this.client.user.id}>`)) args.shift();

			// anexá-lo à estrutura da mensagem
			this.args = args;
			return args;
		}

		// Get User de @ ou ID
		getMember() {
			const users = [];
			// adicionar todos os usuários mencionados
			for (let i = 0; i < this.args.length; i++) {
				if (this.guild.member(this.mentions.users.array()[i] || this.guild.members.cache.get(this.args[i]))) {
					users.push(this.guild.member(this.mentions.users.array()[i] || this.guild.members.cache.get(this.args[i])));
				}
			}
			// search user
			if (this.args[0]) {
				// fetch all members before search
				this.guild.members.fetch();

				// search for members
				const members = [], indexes = [];
				this.guild.members.cache.forEach(member => {
					members.push(member.user.username);
					indexes.push(member.id);
				});
				const match = findBestMatch(this.args.join(' '), members);
				if (match.bestMatch.rating >= 0.1) {
					const username = match.bestMatch.target,
						member = this.guild.members.cache.get(indexes[members.indexOf(username)]);
					users.push(member);
				}
			}
			// add author at the end
			users.push(this.member);
			return users;
		}

		// get channel de # ou ID
		getChannel() {
			const channels = [];
			// obter todos os canais mencionados
			for (let i = 0; i < this.args.length; i++) {
				if (this.mentions.channels.array()[i] || this.guild.channels.cache.get(this.args[i])) {
					channels.push(this.mentions.channels.array()[i] || this.guild.channels.cache.get(this.args[i]));
				}
			}
			channels.push(this.channel);
			return channels;
		}

		// get role de # ou ID
		getRole() {
			const roles = [];
			// obter todos os canais mencionados
			for (let i = 0; i < this.args.length; i++) {
				if (this.mentions.roles.array()[i] || this.guild.roles.cache.get(this.args[i])) {
					roles.push(this.mentions.roles.array()[i] || this.guild.roles.cache.get(this.args[i]));
				}
			}
			if (this.args[0]) {
				const roleList = [];
				this.guild.roles.cache.forEach(r => {
					roleList.push(r.name);
				});
				const match = sm.findBestMatch(this.args.join(' '), roleList);
				if (match.bestMatch.rating != 0) {
					const username = match.bestMatch.target,
						role = this.guild.roles.cache.find(r => r.name == username);
					roles.push(role);
				}
			}
			// retornar a matriz de funções
			return roles;
		}

		// busca o tipo de imagem
		async getImage() {
			const fileTypes = ['png', 'jpeg', 'tiff', 'jpg', 'webp'];
			const file = [];
			// Check attachments
			if (this.attachments.size > 0) {
				const url = this.attachments.first().url;
				for (let i = 0; i < fileTypes.length; i++) {
					if (url.toLowerCase().indexOf(fileTypes[i]) !== -1) {
						file.push(url);
					}
				}

				// no file with the correct format was found
				if (file.length == 0) return this.channel.error(this.guild.settings.Language, 'MUSIC/INVALID_FILE').then(m => m.delete({ timeout: 10000 }));
			}

			// adicionar URLs de avatar aos arquivo
			file.push(...this.getMember().map(member => member.user.displayAvatarURL({ format: 'png', size: 1024 })));
			return file;
		}
		translate(key, args) {
			const language = this.client.translations.get(this.guild ? this.guild.settings.Language : 'pt-BR');
			if (!language) throw 'Mensagem: idioma inválido definido nos dados.';
			return language(key, args);
		}
	}
	return CustomMessage;
});