//Puxando as Dependencias/Pastas/Arquivos nescessarios
const { Embed } = require('../../structures'),
	delay = ms => new Promise(res => setTimeout(res, ms))


	module.exports = {
		name: 'nightcore',
		aliases: ['ngt'],
		category: 'Music',
		description: 'Ative o modo NightCore nas musicas!',
	
		run: async (client, message, args, settings) => {
       //Verificando se há o cargo de DJ no servidor!
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

    //Criando o player 'NightCore'
    if (args[0] && (args[0].toLowerCase() == 'reset' || args[0].toLowerCase() == 'off')) {
        player.resetFilter();
			const msg = await message.channel.send(message.translate('music/nightcore:OFF_NC'));
			const embed = new Embed(client, message.guild)
				.setDescription(message.translate('music/nightcore:DESC_2'));
			await delay(7000);
			return msg.edit('', embed);
    } else {
        player.setFilter({
            equalizer: [
                { band: 1, gain: 0.3 },
                { band: 0, gain: 0.3 },
            ],
            timescale: { pitch: 1.2 },
            tremolo: { depth: 0.3, frequency: 14 },
        });
        const msg = await message.channel.send(message.translate('music/nightcore:ON_NC'));
        const embed = new Embed(client, message.guild)
            .setDescription(message.translate('music/nightcore:DESC_1'));
        await delay(7000);
        player.speed = 1.2;
        return msg.edit('', embed);
        }
    }
};