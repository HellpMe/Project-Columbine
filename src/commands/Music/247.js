module.exports = {
    name: '24/7',
    aliases: ['247'],
    category: 'Music',
    description: 'Altere para o Player 24/7',

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

		// ligando/desligando modo 24/7
		player.twentyFourSeven = !player.twentyFourSeven;
		message.channel.send(message.translate('music/247:RESP', { TOGGLE: player.twentyFourSeven }));
	}
};