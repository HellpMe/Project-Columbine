/* eslint-disable no-undef */
const chalk = require('chalk'),
	{ Webhook_ID, Webhook_Token } = require('./config/webhooks'),
	{ MessageEmbed, ShardingManager, WebhookClient } = require('discord.js');

const webhookClient = new WebhookClient(
	Webhook_ID,
	Webhook_Token,
);

const shard = new ShardingManager('./src/PrCo.js', {
	token: require('./config/config').token,
	autoSpawn: true,
	totalShards: 'auto',
});

shard.on('shardCreate', async (shard) => {
	console.log(chalk.yellowBright('[SHARD LAUNCHED]'), `Shard ${shard.id} has launched.`);

	const shardEmbed = new MessageEmbed()
		.setTitle(`🟢 **Shard ${shard.id}** foi lançado.`)
		.setColor('RANDOM')
		.setTimestamp();

	// Webhook manager
	await webhookClient.send({
		username: 'Shard Manager',
		avatarURL: 'https://i.ytimg.com/vi/3mp0DbLBNuM/maxresdefault.jpg', //imagem que você queira que apareça sobre os status da inicialização do shard
		embeds: [shardEmbed],
	});
});

shard.on('message', async (shard, message) => {
	console.log(chalk.yellowBright(`[SHARD ${shard.id}]`), `${message._eval} : ${message._result}`);

	const shardOnEmbed = new MessageEmbed()
		.setTitle(`🟢 **Shard ${shard.id}** enviou uma mensagem.`)
		.addField('Message Eval', message._eval, true)
		.addField('Message Result', message._result, true)
		.setColor('RANDOM')
		.setTimestamp();

	// Webhook Manager
	await webhookClient.send({
		username: 'Shard Manager',
		avatarURL: 'https://i.ytimg.com/vi/3mp0DbLBNuM/maxresdefault.jpg',//aqui tambem
		embeds: [shardOnEmbed],
	});
});
shard.spawn();