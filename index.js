console.time('Starting time');
console.info('Starting...');

const
  { Client, Collection, GatewayIntentBits, AllowedMentionsTypes } = require('discord.js'),
  { readdirSync } = require('fs');

global.getDirectoriesSync = path => readdirSync(path, { withFileTypes: true }).filter(e => e.isDirectory()).map(directory => directory.name);
global.errorColor = '\x1b[1;31m%s\x1b[0m';

Number.prototype.toFormattedTime = function (num = this) {
  if (isNaN(parseInt(num))) throw new SyntaxError(`${num} is not a valid number!`);
  if (num >= 86400) throw new RangeError(`Number cannot be bigger then 86400, got ${num}!`);

  return new Date(num * 1000).toISOString().substring(num < 3600 ? 14 : 11, 19);
};

require('./website.js');

const client = new Client({
  allowedMentions: {
    parse: [
      AllowedMentionsTypes.User,
      AllowedMentionsTypes.Role
    ]
  },
  shards: 'auto',
  rest: { retries: 2 },
  intents: [
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates
  ]
});

client.startTime = Date.now();
client.categories = getDirectoriesSync('./Commands');
client.functions = {};
client.dashboardOptionCount = {};
client.events = new Collection();
client.cooldowns = new Collection();
client.commands = new Collection();
client.guildData = new Collection();

require('./Handlers/log_handler.js')(client);
for (const handler of readdirSync('./Handlers').filter(e => e != 'log_handler.js')) require(`./Handlers/${handler}`)(client);

client.login(process.env.token)
  .then(_ => client.log(`Logged in`));

process
  .on('unhandledRejection', err => require('./Functions/private/error_handler.js')(err))
  .on('uncaughtExceptionMonitor', err => require('./Functions/private/error_handler.js')(err))
  .on('uncaughtException', err => require('./Functions/private/error_handler.js')(err))