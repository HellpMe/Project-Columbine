const Discord = require('discord.js');
const client = new Discord.Client({disableEveryone: true});
const config = require('./config/config');
const aconfig = require('./config/dashboarsettings');
require('dotenv').config()

client.on('ready', () => {
 if ( aconfig.dashboord = "true") {
  console.log("[HOST] Getting dashboard config file...")
  const webrun = require("../dashboard/dashboard");
  webrun(client);
 } else {
  console.log("[HOST] Dashboard não ativa!!");
 }
});

if (config.token) {
 client.login(config.token);
 console.log("[HOST] Web dashboard client logged");
}