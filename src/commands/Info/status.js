//Puxando as dependencias/Arivos/Pastas nescessarias
const { Embed } = require('../../structures');

module.exports ={
    name: 'status',
    aliases: ['ping'],
    category: 'Info',
    description: 'Veja os status do bot',

    run: async (client, message) => {
            //Puxando as informações do do Client/Bot
    const m = await message.channel.send(message.translate('info/status:CALC'));

    const embed = new Embed(client, message.guild)
    .addField(message.translate('info/status:PING'), `\`${m.createdTimestamp - message.createdTimestamp}ms\``, true)
    .addField(message.translate('info/status:CLIENT'), `\`${Math.round(client.ws.ping)}ms\``, true)
    .addField(message.translate('info/status:MONGO'), `\`${Math.round(await client.mongoose.ping())}ms\``, true)
    .setTimestamp();
await message.channel.send(embed);
m.delete();
    }
}
    
        
