const { Embed } = require('../../structures');
//Puxando as Dependencias/Pastas/Arquivos nescessarios
module.exports = {
	name: 'play',
	aliases: ['p', 'pl'],
	category: 'Music',
	description: 'Coloque uma musica para tocar!',

	run: async (client, message, args, settings) => {
       //Verificando se há o cargo de DJ no servidor
	   if (message.guild.roles.cache.get(settings.MusicDJRole)) {
		if (!message.member.roles.cache.has(settings.MusicDJRole)) {
			return message.channel.error('misc:MISSING_ROLE').then(m => m.delete({ timeout: 10000 }));
		}
	}

	//Verificando se o USER está em um canal de VOZ
	if (!message.member.voice.channel) return message.channel.send('music/play:NOT_VC');

	//Vereificando se o USER está no mesmo canal de VOZ do bot
	if (client.manager.players.get(message.guild.id)) {
		if (message.member.voice.channel.id != client.manager.players.get(message.guild.id).voiceChannel) return message.channel.send('music/play:NOT_VC').then(m => m.delete({ timeout: 6000}));
	}

	//Verificando a permissão do BOT para se CONECTAR ao canal de VOZ
	if (!message.member.voice.channel.permissionsFor(message.guild.me).has('CONNECT'));

	//Verificando a permissão do BOT para se FALAR no canal de VOZ
	if (!message.member.voice.channel.permissionsFor(message.guild.me).has('SPEAK'));

	//Criando o Player de musica
	let player;
	try {
		player = client.manager.create({
			guild: message.guild.id,
			voiceChannel: message.member.voice.channel.id,
			textChannel: message.channel.id,
			selfDeafen: true,
		});
	} catch (err) {
		if (message.deletable) message.delete();
		console.log(`O Comando: 'play' ocorreu o seguinto erro: ${err.message}.`);
		return message.channel.send('misc:ERROR_MESSAGE', { ERROR: err.message }).then(m => m.delete({ timeout: 5000 }));
	}

	//Vericiando se o USER envio algo
	if (args.length == 0) {
		//Verificando o tipo de arquivo que foi enviado para reprodução
		const filesTypes = ['mp3', 'mp4', 'wav', 'm4a', 'webm', 'aac', 'ogg'];
		if (message.attachments.size > 0) {
			const url = message.attachments.first().url;
			for (let i = 0; i < filesTypes.length; i++) {
				if (url.endsWith(filesTypes[i])) {
					args.push(url);
				}
			}
			if (!args[0]) return message.channel.send('music/play:INVALID_FILE').then(m => m.delete({ timeout: 10000}));
		} else {
			return message.channel.send('music/play:NO_INPUT').then(m => m.delete({ timeout: 10000}));
			
		}
	}
	//Puxando a pesquisa enviada pelo USER
	let res;
	const search = args.join(' ');

	//Pesquisando a musica
	try {
		res = await player.search(search, message.author);
		if (res.loadType === 'LOAD_FAILED') {
			if (player.queue.current) player.destroy();
			throw res.exception;
		}
	} catch (err) {
		return message.channel.send('music/play:ERROR', { ERROR: err.message }).then(m => m.delete({ timeout: 5000 }))
	}
	
	//Setando oque fazer com a pesquisa "MUSICA"
	if (res.loadType == 'NO_MATCHES') {
		//Caso ocorra um erro ao carregar a musica
		if (!player.queue.current) player.destroy();
		return message.channel.send('music/play:NO_SONG');
	} else if (res.loadType == 'PLAYLIST_LOADED') {
		//Fazendo o bot conectar-se ao canal caso ele não esteja
		if (player.state !== 'CONNECTED') player.connect();
		//Enviar uma mensagem mostrando quantas musicas foram adicionadas
		const embed = new Embed(client, message.guild)
		.setColor(message.member.displayHexColor)
		.setDescription(message.translate('music/play:QUEUED', { NUM: res.tracks.length }));
	message.channel.send(embed);//Adicionando as musicas na fila
		player.queue.add(res.tracks);
		//Tocando as musicas caso esteja pronto
		if (!player.playing && !player.paused && player.queue.totalSize === res.tracks.length) player.play();
	} else {
		//Adicionando a musica na fila e reproduzindo
		if (player.state !== 'CONNCTED') player.connect();
		player.queue.add(res.tracks[0]);
		if (!player.playing  && !player.queue.size) {
			player.play();
		} else {
			message.channel.send({ embed: { color: message.member.displayHexColor, description:`Added to queue: [${res.tracks[0].title}](${res.tracks[0].uri})` } });
			}
		}
	}
};