//Puxando as Dependencias/Pastas/Arquivos nescessarios
const { MessageEmbed } = require('discord.js');

exports.run = async (client, message,) => {

    const msg = await message.channel.send('Puxando todas as informações do lavalink, aguarde..');

    const {	memory,	cpu,	uptime,	playingPlayers,	players } = client.manager.nodes.first().stats;
    
    //Puxando a memoria disponivel no servidor "LavaLink"
    const allocated = Math.floor(memory.allocated / 1024 / 1024);
	const used = Math.floor(memory.used / 1024 / 1024);
	const free = Math.floor(memory.free / 1024 / 1024);
	const reservable = Math.floor(memory.reservable / 1024 / 1024);

    const systemLoad = (cpu.systemLoad * 100).toFixed(2);
    const lavalinkLoad = (cpu.lavalinkLoad * 100).toFixed(2);

//    const clientUptime = uptime(uptime);

    const embed = new MessageEmbed()
    .setAuthor('Status lavalink')
    .addField('Players Ativos', `\`\`\`${playingPlayers} Tocando agora / ${players} Players\`\`\``)
    .addField('Memoria', `\`\`\`Alocada: ${allocated} MB\nUsada: ${used} MB\nLivre: ${free} MB\nReservada: ${reservable} MB\`\`\``)
    .addField('CPU', `\`\`\`Cores: ${cpu.cores}\nUso do sistema: ${systemLoad}%\nUso do lavalink: ${lavalinkLoad}%\`\`\``)
//    .addField('Uptime', `\`\`\`${clientUptime}\`\`\``)
    .setTimestamp(Date.now());
        return msg.edit('', embed);
};
/*
        	uptime(time); {
		const calculations = {
			week: Math.floor(time / (1000 * 60 * 60 * 24 * 7)),
			day: Math.floor(time / (1000 * 60 * 60 * 24)),
			hour: Math.floor((time / (1000 * 60 * 60)) % 24),
			minute: Math.floor((time / (1000 * 60)) % 60),
			second: Math.floor((time / 1000) % 60),
		};

		let str = '';

		for (const [key, val] of Object.entries(calculations)) {
			if (val > 0) str += `${val} ${key}${val > 1 ? 's' : ''} `;
		}

		return str;
	};
*/