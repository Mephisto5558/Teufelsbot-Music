console.time('Initializing time');
console.info('Starting...');

const
  { Client, GatewayIntentBits, AllowedMentionsTypes } = require('discord.js'),
  { existsSync, readdirSync } = require('fs'),
  DB = require('@mephisto5558/mongoose-db'),
  { gitpull, errorHandler, distube } = require('./Utils');

require('./Utils/prototypeRegisterer.js');

console.timeEnd('Initializing time');
console.time('Starting time');

(async function main() {
  await gitpull();

  const client = new Client({
    shards: 'auto',
    failIfNotExists: false,
    allowedMentions: {
      parse: [
        AllowedMentionsTypes.User,
        AllowedMentionsTypes.Role
      ]
    },
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildVoiceStates,
      GatewayIntentBits.MessageContent,
    ]
  });

  client.on('error', err => errorHandler.call(client, err));
  let env;

  if (existsSync('./env.json')) env = require('./env.json');
  else {
    client.db = await new DB(process.env.dbConnectionStr).fetchAll();
    env = client.settings.env;
  }

  env = env.global.fMerge(env[env.global.environment]);

  if (!client.db) client.db = await new DB(env.dbConnectionStr).fetchAll();

  client.botType = env.environment;
  client.keys = env.keys;
  client.distube = distube.call(client);

  for (const handler of readdirSync('./Handlers')) require(`./Handlers/${handler}`).call(client);

  await client.login(client.keys.token);
  client.log(`Logged into ${client.botType}`);

  process
    .on('unhandledRejection', err => errorHandler.call(client, err))
    .on('uncaughtExceptionMonitor', err => errorHandler.call(client, err))
    .on('uncaughtException', err => errorHandler.call(client, err));
})();