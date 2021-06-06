const { Manager } = require('erela.js'),
    Deezer = require('erela.js-deezer'),
    Spotify = require('erela.js-spotify'),
    { MessageEmbed } = require('discord.js')
require('./Music/Player');

module.exports = async (client) => {
    const clientID = client.config.api_keys.spotify.iD;
    const clientSecret = client.config.api_keys.spotify.secret

    client.manager = new Manager({
        nodes: [
            { host: 'localhost', port: 3000, password: 'PrCoJs'},
        ],
        plugins: [
            new Spotify({ clientID, clientSecret }),
            new Deezer({ playlistLimit: 1, albumLimit: 1 })
        ],
        autoPlay: true,
        send(id, payload) {
            const guild = client.guilds.cache.get(id);
            if (guild) guild.shard.send(payload);
        },
    })
    .on('nodeConnect', node => console.log(`Lavalink node: ${node.options.identifier} foi conectado!!`))
    .on('nodeDisconnect', (node, reason) => console.log(`Lavalink node: ${node.options.identifier} foi desconectado pelo seguinte motivo: ${(reason.reason) ? reason.reason : 'não especificado'}.`))
    .on('nodeError', (node, error) => console.log(`Lavalink node: '${node.options.identifier}', Ocorreu o seguinte erro: '${error.message}'.`))
    .on('playerCreate', player => console.log(`Lavalink player foi criado no seguinte servidor: [${player.guild}].`))
    .on('playerDestroy', player => console.log(`Lavalink player foi desligado do seguinte servidor: [${player.guild}].`))
    .on('trackStart', (player, track) => {
        //Ao iniciar as musicas!
        const embed = new MessageEmbed()
        .setColor(client.guilds.cache.get(player.guild).member(track.requester).displayHexColor)
        .setTitle('» Tocando agora:')
        .setDescription(`[${track.title}](${track.uri}) [${client.guilds.cache.get(player.guild).member(track.requester)}]`)
        const channel = client.channels.cache.get(player.textChannel);
        if (channel) channel.send(embed).then(m => m.delete({ timeout: (track.duration < 6.048e+8) ? track.duration: 60000}))
        //Checando a fila de musica
        if (player.timeout != null) return clearTimeout(player.timeout);
    })
    .on('trackError', (player, track, payload) => {

        //debug
        if (client.config.debug) console.log(`Track error: ${payload.error} in guild: ${player.guild}.`);
        //resetando os filtros
        player.resetFilter();
        //Enviando a embed caso aconteça algum erro!
        const embed = new MessageEmbed()
        .setColor('#8b0000')
        .setDescription(`Ocorreu o seguinte erro ao tocar a musica: \`${payload.error}\``);
        const channel = client.channels.cache.get(player.textChannel);
        if (channel) channel.send(embed).then(m => m.delete({ timeout: 15000 }));
    })
    .on('queueEnd', (player) => {
        //modulo 24/7
        if (player.twentyFourSeven) return;
        //Enviado a Embed quando a musica acabar ou o bot ficar sozinho no canal
        player.timeout = setTimeout(() => {
            const embed = new MessageEmbed()
                .setDescription(`Saí do canal de voz **${client.channels.cache.get(player.voiceChannel).name}** porque fiquei inativo por muito tempo. Se você for um membro Premium, você pode desativar isso digitando prefixo24/7.`);
            const channel = client.channels.cache.get(player.textChannel);
            if (channel) channel.send(embed);
            player.destroy();
        }, 120000);
    })
    .on('playerMove', (player, currentChannel, newChannel) => {
        //Setando no lavalink o canal para que o bot foi mudado!!
        if (!newChannel) {
            const channel = client.channels.cache.get(player.textChannel);
            if (channel) channel.send('A fila terminou quando fui expulso do canal de voz');
            player.destroy();
            } else {
                player.voiceChannel = client.channels.cache.get(newChannel);
			}
		});
    //Atualizando o status de voice
    client.on('raw', d => client.manager.updateVoiceState(d));
}