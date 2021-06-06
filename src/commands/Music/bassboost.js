//Puxando as Dependencias/Pastas/Arquivos nescessarios
const { Embed } = require('../../structures'),
	delay = ms => new Promise(res => setTimeout(res, ms));

	module.exports = {
		name: 'bassboost',
		aliases: ['bass', 'bb'],
		category: 'Music',
		description: 'Altere o Grave das Musica!',
	
		run: async (client, message, args, settings) => {
       //Verificando se há o cargo de DJ no servidor
	   if (message.guild.roles.cache.get(settings.MusicDJRole)) {
		if (!message.member.roles.cache.has(settings.MusicDJRole)) {
			return message.channel.error('misc:MISSING_ROLE').then(m => m.delete({ timeout: 10000 }));
		}
	}

    //Verificando se há musicas na fila/Reproduzidas
    const player = client.manager.players.get(message.guild.id);
    if (!player) return message.channel.send('misc:NO_QUEUE').then(m => m.delete({ timeout: 5000 }));

    //Verificando se o USER está no mesmo canal que VOZ que o BOT
    if (message.member.voice.channel.id !== player.voiceChannel) return message.channel.send('misc:NOT_VOICE').then(m => m.delete({ timeout: 5000 }));

    //defenindo por padrão o bassboost
    if (!args[0]) {
        player.setFilter({
            equalizer: [
                ...Array(6).fill(0).map((n, i) => ({ band: i, gain: 0.65 })),
                ...Array(9).fill(0).map((n, i) => ({ band: i + 6, gain: 0 })),
            ],
        });
		const msg = await message.channel.send(message.translate('music/bassboost:ON_BB'));
		const embed = new Embed(client, message.guild)
			.setDescription(message.translate('music/bassboost:DESC_1'));
		await delay(7000);
		return msg.edit('', embed);
    }
    		// Turn off bassboost
		if (args[0].toLowerCase() == 'reset' || args[0].toLowerCase() == 'off') {
			player.resetFilter();
			const msg = await message.channel.send(message.translate('music/bassboost:OFF_BB'));
			const embed = new Embed(client, message.guild)
				.setDescription(message.translate('music/bassboost:DESC_1'));
			await delay(7000);
			return msg.edit('', embed);
		}

		// Caso numero não seja valido
		if (isNaN(args[0])) return message.channel.send(message.translate('music/bassboost:INVALID'));

		// colocando valores customizados
		player.setFilter({
			equalizer: [
				...Array(6).fill(0).map((n, i) => ({ band: i, gain: args[0] / 10 })),
				...Array(9).fill(0).map((n, i) => ({ band: i + 6, gain: 0 })),
			],
		});
		const msg = await message.channel.send(message.translate('music/bassboost:SET_BB', { DB: args[0] }));
		const embed = new Embed(client, message.guild)
			.setDescription(message.translate('music/bassboost:DESC_3', { DB: args[0] }));
		await delay(7000);
		return msg.edit('', embed);
	}
};