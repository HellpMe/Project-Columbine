/*
* Reinscrição do código para otimizações/melhorias
* Start in: 28/05/21
* End At:
*/

//Puxando modulos nescessarios
const Client = require('./base/PrCo');
require('./structures');
const  fs = require('fs');
const  chalk = require('chalk');
const  client = new Client();

//Carregando a pasta events
fs.readdir("./src/events/", (err, files) => {
    if (err) return console.error(err);
    console.log(chalk.magenta("[-] Carregando Eventos..."));
    files.forEach(file => {
      const event = require(`./events/${file}`);
      let eventName = file.split(".")[0];
      client.on(eventName, event.bind(null, client));
    });
    console.log(chalk.greenBright(`[+] Eventos Carregados!!`));
  });

//Carregando as pastas de comandos
fs.readdir("./src/commands/", (err, dirs) => {
  if (err) return console.error(err);
  dirs.forEach(dir => {
    fs.readdir(`./src/commands/${dir}/`, (err, files) => {
      files.forEach(file => {
        if (!file.endsWith(".js")) return;
        let pull = require(`./commands/${dir}/${file}`);
        client.commands.set(pull.name, pull)
        pull.aliases.forEach(alias => {
          client.aliases.set(alias, pull.name)
        })
      });
    });
  });
  console.log(chalk.magenta("[-] Carregando Comandos..."));
  console.log(chalk.greenBright(`[+] Comandos Carregados!!`));
});
(async () => {

//Ligando o Player de Musica
try {
  await require('./base/Audio-Player')(client);
} catch (e) {
console.log(e)
}
//Iniciando a segunda DataBase
client.mongoose.init(client);
//Traduções
client.translations = await require('./structures/LanguageManager')();

})();
//Processo para ligar o bot
const token = client.config.token;
client.login(token).catch(e => console.log(e.message));

process.on("rejectionHandled", (err) => {
  console.log(`rejectionHandled Error: ${err.message}`);
 
  //Mostrar o erro com o debug ativo
  if (client.config.debug) console.log(err);
});
//caso aconteça algum erro o bot não desligar
process.on('unhandledRejection', err => {
  console.log(`unhandledRejection Error: ${err.message},`);

  //Mostrar o erro com o debug ativo
  if (client.config.debug) console.log(err);
});
process.on('uncaughtException', err => {
  console.log(`uncaughtException Error: ${err.message} `)

  //Mostrar o erro com o debug ativo
  if (client.config.debug) console.log(err);
});