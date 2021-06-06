const Discord = require("discord.js");
const client = new Discord.Client();

module.exports = {
    name: 'eval',
    aliases: ['evl'],
    category: 'Host',
    description: 'Eval?',

    run: async (client, message, args, settings) => {
        if (!client.config.ownerID.includes(message.author.id)) {
            return message.channel.send('host/eval:EVAL_NO_OWNER')
            }
            let code = args.slice(0).join(" ");
            
                try {
                let ev = require('util').inspect(eval(code));
                if (ev.length > 1950) {
                    ev = ev.substr(0, 1950);
                }
                  let embed = new Discord.MessageEmbed()
                  .setDescription(`:inbox_tray: **ENTRADA**\n\`\`\`js\n${code}\`\`\`\n:outbox_tray: **SAÍDA**\n\`\`\`js\n${ev}\`\`\``)
                  .setColor('#00000')
                message.channel.send(embed)
                } catch(err) {
                  
                  let errorrr = new Discord.MessageEmbed()
                  .setDescription(`<> **ERRO DETECTADO!**\n\`\`\`\n${err}\`\`\``)
                  .setColor('RED')
                    message.channel.send(errorrr)
                }
    }
};