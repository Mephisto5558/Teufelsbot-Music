console.time('Starting time');
console.log('Starting...');

const { Client, Collection } = require('discord.js');
const fs = require('fs');

fs.rmSync('./Logs/debug.log', { force: true });

const client = new Client({ intents: 32767 });
client.on('debug', debug => fs.appendFileSync('./Logs/debug.log', debug + `\n`));

module.exports = client;

client.userID = '979747543405711371';
client.owner = '691550551825055775';
client.events = new Collection();
client.slashCommands = new Collection();
client.cooldown = new Collection();
client.categories = fs.readdirSync('./Commands/');
client.sleep = function sleep(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}
client.log = function log(data) {
  let date = new Date().toLocaleString('en-GB', {
    hour12: false,
    hour:   '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  console.log(`[${date}] ${data}`)
};

for(const handler of fs.readdirSync('./Handlers').filter(file => file.endsWith('_handler.js'))) {
  require(`./Handlers/${handler}`)(client);
}

client.login(process.env.token)
  .then(client.log('Logged in'));

process.on('exit', async _ => {
  client.destroy();
});