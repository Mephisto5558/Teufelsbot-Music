console.time('Starting time');
console.log('Starting...');

const
  { Client, Collection, MessageEmbed } = require('discord.js'),
  fs = require('fs'),
  { colors } = require('./Settings/embed.json'),
  errorColor = require('chalk').bold.red,
  client = new Client({ intents: 32767 });

fs.rmSync('./Logs/debug.log', { force: true });

client.on('debug', debug => {
  if (
    debug.includes('Sending a heartbeat.') ||
    debug.includes('Heartbeat acknowledged')
  ) return;

  const timestamp = new Date().toLocaleString('en', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  fs.appendFileSync('./Logs/debug.log', `[${timestamp}] ${debug}\n`);
  if (debug.includes('Hit a 429')) {
    if (!client.isReady()) {
      console.error(errorColor('Hit a 429 while trying to login. Restarting shell.'));
      process.kill(1);
    }
    else console.error(errorColor('Hit a 429 while trying to execute a request'));
  }
});

client.userID = process.env.userID;
client.owner = process.env.ownerID;
client.events = new Collection();
client.slashCommands = new Collection();
client.cooldown = new Collection();
client.categories = fs.readdirSync('./Commands/');
client.sleep = function sleep(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}
client.log = function log(data) {
  const date = new Date().toLocaleString('en', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  console.log(`[${date}] ${data}`)
};

for (const handler of fs.readdirSync('./Handlers').filter(file => file.endsWith('.js'))) {
  require(`./Handlers/${handler}`)(client);
}

client.login(process.env.token)
  .then(client.log('Logged in'));

process.on('exit', async _ => {
  client.destroy();
});

Number.prototype.toFormattedTime = function toFormattedTime(seconds) {
  if (typeof seconds != 'number') throw new SyntaxError(`seconds must be type of number, received ${typeof seconds}`);
  if (seconds >= 86400) throw new RangeError(`seconds cannot be bigger then 86400!, got ${seconds}`);

  return new Date(1000 * seconds).toISOString().substring(seconds < 3600 ? 14 : 11, 19);
}

global.editReply = function editReply(interaction, content, asEmbed, asError) {
  if (!content) throw new SyntaxError('Missing data to send');

  if (asEmbed) {
    const embed = new MessageEmbed({
      title: 'Music Player',
      description: content,
      color: asError ? colors.discord.RED : colors.discord.BURPLE
    });

    content = { embeds: [embed] };
  }

  if (typeof content == 'object') {
    for (const item of Object.entries(content)) {
      if (item[1] && ['embeds', 'files', 'attachments', 'components'].includes(item[0]) && !item[1]?.[0])
        item[1] = Array(item[1]);
    }

    if (asError) for (const embed of content.embeds) embed.color = colors.discord.RED;

    interaction.editReply({
      embeds: content.embeds || [],
      content: content.content || null,
      files: content.files || [],
      attachments: content.attachments || [],
      components: content.components || []
    })
  }
  else interaction.editReply(content);
}