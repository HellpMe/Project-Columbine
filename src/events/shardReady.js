const { MessageEmbed } = require("discord.js"),
        chalk = require("chalk");

module.exports = async (client, id) => {
  console.log(chalk.greenBright("[SHARD READY]"), `Shard ${id} is ready.`);

  let readyEmbed = new MessageEmbed()
    .setTitle(`🟢 **Shard ${id}** Conectado e Pronto!`)
    .setColor("RANDOM")
    .setTimestamp();

};