//Puxando as dependencias/modulos/pastas necessarias
const chalk = require('chalk'),
 { GuildSchema } = require('../database/models');

module.exports = async client => {
    //Puxando as estatísticas do bot
    console.log(chalk.rgb(833, 95, 67).underline("Bot iniciado com sucesso!"),` \nUser: ${client.user.tag}, \nCom: ${client.guilds.cache.reduce((total,guild) => total + guild.memberCount, 0)} usúarios, \nEm: ${client.channels.cache.size} canais, \nE em: ${client.guilds.cache.size} servidores.\n`
    );

    client.appInfo = await client.fetchApplication();
    //Iniciando o Player de Audio
    client.manager.init(client.user.id)
/*    //Iniciando a dashbord
if(client.config.defaultSettings.Dashboard){
    const Dashboard = require("../../dashboard/dashboard");
    Dashboard(client); 
}*/
    setInterval(async () =>{
        client.appInfo = await client.fetchApplication();
    }, 60000)
    //Adicionandos os status ao bot
    //WATCHING = ASSISTINDO, LISTENING = OUVINDO, PLAYING = JOGANDO faz aí os status que quiser
    //Pode se adicionar quantos status quiser, só seguir o exemplo abaixo!!
      var status = [
          {name: "Working in version v1.0.0", type: "WATCHING" },
          {name: `Jogando com ${client.guilds.cache.reduce((total,guild) => total + guild.memberCount, 0)} usuários!`, type: "STREAMING", url: "https://www.twitch.tv/cyberplank_2077"},
      ];

      function setStatus() {
          var altstatus = status[Math.floor(Math.random() * status.length)]
          client.user.setActivity(altstatus);
      }
    //Defina o tempo que deseja para que os status alternem entre-si
    //Defina em MS 1seg = 1000ms
      setStatus();
      setInterval(() => setStatus(), 100000);

    //Mudando o Avatar do bot de tempos em tempos
    //Você pode colocar quantos quiser, porem vou adicionar apenas 3
      var avatars = [
          "https://hellpme.github.io/assets/apoios-github/CyberPlank_2077.jpg",
          "https://hellpme.github.io/assets/apoios-github/TvKes.png"
      ];

      function setAvatars() {
          var altavatars = avatars[Math.floor(Math.random() * avatars.length)]
          client.user.setAvatar(altavatars).catch((err) => {
            console.error(err);//caso coloque para ele ficar trocando rapido de avatar, provavelmente aparecerá erros avisando que está muito rapido
        });
      }
      setAvatars();
      setInterval(() => setAvatars(), 40 * 60000);

    //verificando se adicionaram o bot enquanto ele estava offline
    client.guilds.cache.forEach(async item => {
        await item.fetchGuildConfig();
        if (item.settings == null) {
    //Servidor novo encontrado
            client.emit('guildCreate', item);
        }
    });
    //Excluindo as configs dos servidores que nos removeram enquanto o bot estava off
    const data = await GuildSchema.find({});
    if (data.length > client.guilds.cache.size) {
    //Procurando os servidores em que o bot foi kikado enqto estava offline
        const guildCount = [];
    //Buscando os IDS
        for (let i = 0; i < client.guilds.cache.size; i++) {
            guildCount.push(client.guilds.cache.array()[i].id);
        }
    //Verificando os banco de dados para exclusão
        for (let i = 0; i < data.length; i++) {
            if (!guildCount.includes(data[i].guildID)) {
                const guild = {
                    id: `${data[i].guildID}`,
                    name: `${data[i].guildName}`,
                };
                client.emit('guildDelete', guild);
            }
        }
    }
    //buscando servers novos
	setInterval(async () => {
        if (client.config.debug) console.log('Buscando Dados (Intervalo: 1 minuto)');
        client.guilds.cache.forEach(async guild => {
        guild.fetchGuildConfig();
            });
        }, 60000);
}