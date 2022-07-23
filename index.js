console.time('Starting time');
console.log('Starting...');

const
  { Client, Collection, GatewayIntentBits, Partials } = require('discord.js'),
  webServer = require('express')();

  Number.prototype.toFormattedTime = _ => {
    if (isNaN(parseInt(this))) throw new SyntaxError(`${this} is not a valid number!`);
    if (this >= 86400) throw new RangeError(`Number cannot be bigger then 86400, got ${this}!`);

    return new Date(this * 1000).toISOString().substring(this < 3600 ? 14 : 11, 19);
  }

  Object.defineProperty(Number.prototype, 'toFormattedTime', {});

(async _ => {
  webServer.all('*', (_, res) => res.sendStatus(200));
  webServer.listen(8000, _ => console.log('Website is online'));
  
  const client = new Client({
    partials: [Partials.Message, Partials.Channel, Partials.Reaction],
    allowedMentions: { parse: ['users', 'roles'] },
    shards: 'auto',
    retryLimit: 2,
    intents: [
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.Guilds
    ]
  });

  let defaultSettings;

  if (existsSync('./env.json')) defaultSettings = require('./env.json');
  else defaultSettings = process.env;

  defaultSettings = Object.assign({}, defaultSettings.global,
    defaultSettings[defaultSettings.global.environment],
    { keys: Object.assign({}, defaultSettings.global.keys, defaultSettings[defaultSettings.global.environment].keys) }
  );

  client.userID = defaultSettings.botUserID;
  client.botType = defaultSettings.type;
  client.startTime = Date.now();
  client.categories = getDirectoriesSync('./Commands');
  client.functions = {};
  client.dashboardOptionCount = {};
  client.keys = defaultSettings.keys;
  client.lastRateLimit = new Collection();
  client.events = new Collection();
  client.cooldowns = new Collection();
  client.commands = new Collection();
  client.guildData = new Collection();
  client.log = (...data) => {
    const date = new Date().toLocaleTimeString('en', { timeStyle: 'medium', hour12: false });
    console.log(`[${date}] ${data}`)
  };

  for (const handler of readdirSync('./Handlers')) require(`./Handlers/${handler}`)(client);

  await client.login(client.keys.token);
  client.log(`Logged into ${client.botType}`);

  process.on('exit', _ => client.destroy());
})();