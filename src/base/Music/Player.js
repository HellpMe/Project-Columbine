const { Structure } = require('erela.js');

module.exports = Structure.extend('Player', Player => {
	class player extends Player {
		constructor(...args) {
			super(...args);
			this.speed = 1;
			this.twentyFourSeven = false;
			this.previousTracks = [];
			this.timeout = null;
		}

		// adicionando os filtros
		setFilter(body = {}) {
			this.node.send({
				op: 'filters',
				guildId: this.guild.id || this.guild,
				...body,
			});
			return this;
		}

		// resetando os filtros
		resetFilter() {
			this.node.send({
				op: 'filters',
				guildId: this.guild.id || this.guild,
				...{},
			});
			return this;
		}

		// Alterar a velocidade de reprodução
		setSpeed(value) {
			this.speed = value;
			this.node.send({
				op: 'filters',
				guildId: this.guild.id || this.guild,
				timescale: { speed: value },
			});
			return this;
		}
	}
	return player;
});