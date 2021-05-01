//Puxandos os modulos pastas e arquivos nescessarios
const { MessageEmbed, Collection } = require('discord.js'),
    firebase = require('firebase'),
    db = firebase.database(),
    moment = require('moment')
    require("moment-duration-format");

module.exports = async (client, message) => {
    //recordando as msg que o bot enviar
    client.messagesSent++;
    
    if(message.author.bot) return;
    if(message.channel.type === 'dm') return;

    //Puxando do banco de dados o prefixo!
    let prefix = await db.ref(`Configurações/Servidores/${message.guild.id}/Prefixo`).once('value')
    prefix = prefix.val().prefixo
    
    //Puxando o prefixo do arquivo config.json
    if(!prefix) prefix = prefix;

    //Caso o user mencione o bot ira mencionar ele e o bot
    //Criando a menção e a embed para enviar no canal
        if(message.content == `<@!${client.user.id}>`) {
            let embed = new MessageEmbed()

            .setAuthor(client.user.username, client.user.displayAvatarURL({ format: 'png' }))
			.setThumbnail(client.user.displayAvatarURL({ format: 'png' }))
            .setTitle('About me')
            .setDescription([`Meu Prefixo nesse servidor é \`${prefix}\`, Use \`${prefix}ajuda\` Para Ver Meus Comandos!`,
                            `Estou online há ${moment.duration(client.uptime).format('d[days] h[hrs] m[mins] s[segs]')}, com ${client.guilds.cache.reduce((total,guild) => total + guild.memberCount, 0)} usuários e em ${client.guilds.cache.size} servidores!!`].join('\n\n'))
        message.channel.send(embed)
    }; 
    //Agora puxando a handler para executar o comando
    const args = message.content
        .slice(prefix.length)
        .trim()
        .split(/ +/g);
    let cmd = args.shift().toLowerCase();

    //Adicionando cooldown nos comandos
     if (!client.cooldowns.has(cmd)) {
        client.cooldowns.set(cmd, new Collection());
    }
    var now = Date.now();
    const timestamps = client.cooldowns.get(cmd)
    //definindo o tempo de cd, 1000ms = 1seg
    const cooldownAmount = (4000);
        
    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
            
        if (now < expirationTime) {
            const timeleft = (expirationTime - now) / 1000
            let timeleft2 = timeleft.toFixed(1)
            return message.channel.send({ embed: { color: message.member.displayHexColor, description:`Você deve esperar ${timeleft2} segundos, para usar o comando novamente!!`}}).then(m => m.delete({ timeout:4000 }));
        }
    }
    //Puxando os iniciadores dos comandos
    client.commandsUsed++;
    if (client.config.debug) console.log(`Comando: ${cmd} foi usado por ${message.author.tag}${!message.guild ? '' : ` no servidor: ${message.guild.id}`}.`);
    
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    let command = client.commands.get(cmd);
    if (command) {
        command.run(client, message, args);
        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    } 
}
