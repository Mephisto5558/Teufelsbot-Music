console.log("Starting...")

const { Client, Collection } = require("discord.js");

const fs = require("fs");
fs.rmSync('./Logs/debug.log', { force: true });

const client = new Client({ intents: 32767 });
client.on('debug', debug => fs.appendFileSync('./Logs/debug.log', debug + `\n`));

module.exports = client;

client.prefix = '.';
client.userID = '948978571802710047';
client.owner = '691550551825055775';
client.events = new Collection();
client.cooldown = new Map();
client.commands = new Collection();
client.categories = fs.readdirSync("./Commands/");
client.slashCommandList = [];
client.sleep = function sleep(milliseconds) { 
  return new Promise(resolve => setTimeout(resolve, milliseconds))
};

//const client2 = client;
//client2.prefix = '.2';
//client2.userID = '964315306015211560'; 

fs.readdirSync("./Handlers").filter((file) => file.endsWith("_handler.js")).forEach((handler) => { 
  require(`./Handlers/${handler}`)(client);  //require(`./Handlers/${handler}`)(client2);
});


client.login(process.env.token) .then(console.log("Logged in (1)"));

//client2.login(process.env.token2)
//  .then(console.log("Logged in (2)")); 

process.on('exit', async() => {
  client.destroy();   //client2.destroy();
});