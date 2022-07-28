console.time('Starting time');
console.log('Starting...');

const
  { Client, Collection, GatewayIntentBits, Partials } = require('discord.js'),
  { readdirSync } = require('fs');

global.getDirectoriesSync = path => readdirSync(path, { withFileTypes: true }).filter(e => e.isDirectory()).map(directory => directory.name);
global.errorColor = '\x1b[1;31m%s\x1b[0m';

Number.prototype.toFormattedTime = function (num = this) {
  if (isNaN(parseInt(num))) throw new SyntaxError(`${num} is not a valid number!`);
  if (num >= 86400) throw new RangeError(`Number cannot be bigger then 86400, got ${num}!`);

  return new Date(num * 1000).toISOString().substring(num < 3600 ? 14 : 11, 19);
};

(async _ => require('./website.js'))();

const client = new Client({
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
  allowedMentions: { parse: ['users', 'roles'] },
  shards: 'auto',
  retryLimit: 2,
  intents: [
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates
  ]
});

client.startTime = Date.now();
client.categories = getDirectoriesSync('./Commands');
client.functions = {};
client.dashboardOptionCount = {};
client.lastRateLimit = new Collection();
client.events = new Collection();
client.cooldowns = new Collection();
client.commands = new Collection();
client.guildData = new Collection();
client.log = (...data) => {
  const date = new Date().toLocaleTimeString('en', { timeStyle: 'medium', hour12: false });
  console.info(`[${date}] ${data}`)
};

for (const handler of readdirSync('./Handlers')) require(`./Handlers/${handler}`)(client);

client.login(process.env.token)
  .then(_ => client.log(`Logged in`));

client.rest.on('rateLimited', info => client.log(`Waiting for ${info.global ? 'global ratelimit' : `ratelimit on ${info.route}`} to subside (${info.timeToReset}ms)`));

process
  .on('unhandledRejection', err => require('./Functions/private/error_handler.js')(err))
  .on('uncaughtExceptionMonitor', err => require('./Functions/private/error_handler.js')(err))
  .on('uncaughtException', err => require('./Functions/private/error_handler.js')(err))
  .on('exit', _ => client.destroy());