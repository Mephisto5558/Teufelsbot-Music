console.time('Starting time');
console.info('Starting...');

const
  { Client, Collection, GatewayIntentBits, AllowedMentionsTypes, CommandInteraction } = require('discord.js'),
  { readdirSync } = require('fs'),
  editPlayer = require('./Functions/private/editPlayer.js');

global.getDirectoriesSync = path => readdirSync(path, { withFileTypes: true }).filter(e => e.isDirectory()).map(directory => directory.name);
global.errorColor = '\x1b[1;31m%s\x1b[0m';

Number.prototype.toFormattedTime = function () {
  if (isNaN(parseInt(this))) throw new SyntaxError(`${this} is not a valid number!`);
  if (this >= 86400) throw new RangeError(`Number cannot be bigger then 86400, got ${this}!`);

  return new Date(this * 1000).toISOString().substring(this < 3600 ? 14 : 11, 19);
};
CommandInteraction.prototype.editPlayer = editPlayer;

require('./website.js');

const client = new Client({
  allowedMentions: {
    parse: [
      AllowedMentionsTypes.User,
      AllowedMentionsTypes.Role
    ]
  },
  shards: 'auto',
  intents: [
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates
  ]
});

client.startTime = Date.now();
client.functions = {};
client.dashboardOptionCount = {};
client.events = new Collection();
client.cooldowns = new Collection();
client.guildData = new Collection();

for (const handler of readdirSync('./Handlers')) require(`./Handlers/${handler}`).call(client);

client.login(process.env.token)
  .then(_ => client.log(`Logged in`));

process
  .on('unhandledRejection', require('./Functions/private/error_handler.js').bind(client))
  .on('uncaughtExceptionMonitor', require('./Functions/private/error_handler.js').bind(client))
  .on('uncaughtException', require('./Functions/private/error_handler.js').bind(client))