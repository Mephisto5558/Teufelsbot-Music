module.exports = (client) => {
  const fs = require('fs');
  let commandCount = 0;
  
  fs.readdirSync("./Commands").forEach(cmd => {
    fs.readdirSync(`./Commands/${cmd}/`).filter((file) => file.endsWith(".js")).forEach((command) => {
      let pull = require(`../Commands/${cmd}/${command}`);
      if (pull.name) {
        if(pull.disabled) return;
        client.commands.set(pull.name, pull);
        client.slashCommandList.push(pull)
        console.log(`Loaded Slash Command ${pull.name}`)
        commandCount++
      }
      if (pull.aliases && Array.isArray(pull.aliases)) pull.aliases.forEach(alias => client.aliases.set(alias, pull.name));
    });
  });
  
  console.log(`${commandCount} Slash Commands loaded\n`);
}
const
  fs = require('fs'),
  { Client } = require('discord-slash-commands-client'),
  chalk = require('chalk'),
  event = require('../Events/interactionCreate.js'),
  errorColor = chalk.bold.red;

let commandCount = 0;
let commands = [];

function work(option) {
  if(!option.type) return option.type = 1
  
  if(/[A-Z]/.test(option.name)) {
    console.log(errorColor(`${option.name} IS UPPERCASE! UPPERCASE IS INVALID! Fixing.`))
    option.name = option.name.toLowerCase();
  };

  option.type = option.type.toString()
    .replace('SUB_COMMAND', 1).replace('SUB_COMMAND_GROUP', 2)
    .replace('STRING', 3).replace('INTEGER', 4)
    .replace('BOOLEAN', 5).replace('USER', 6)
    .replace('CHANNEL', 7).replace('ROLE', 8)
    .replace('MENTIONABLE', 9).replace('NUMBER', 10)
    .replace('ATTACHMENT', 11)
};


module.exports = async client => {
  const commandClient = new Client(
    client.keys.token,
    client.userID
  );

  fs.readdirSync('./Commands').forEach(subFolder => {
    fs.readdirSync(`./Commands/${subFolder}/`).filter(file => file.endsWith('.js')).forEach(file => {
      let command = require(`../Commands/${subFolder}/${file}`);
      if(!command.slashCommand || command.disabled || (client.botType == 'dev' && !command.beta)) return;

      if(Array.isArray(command.options))
        command.options.forEach(option => { work(option) });
      else if(command.options) work(commandOption.options);
      commands.push(command)
      client.slashCommands.set(command.name, command)
    })
  });

  for(let command of commands) {
    await commandClient.createCommand({
        name: command.name,
        description: command.description,
        options: command.options
      })
      .then(_ => {
        client.log(`Registered Slash Command ${command.name}`);
        commandCount++
      })
      .catch(err => {
        console.error(errorColor('[Error Handling] :: Unhandled Slash Handler Error/Catch'));
        console.error(err);
        if(err.response.data.errors)
          console.error(errorColor(JSON.stringify(err.response.data, null, 2)));
      });
    if(commands[commandCount + 1]) await client.functions.sleep(10000);
  };

  client.log(`Loaded ${commandCount} Slash commands\n`);

  client.on('interactionCreate', event.bind(null, client))
  client.log(`Loaded Event interactionCreate`);
  client.log(`Ready to receive slash commands\n`);

  do {
    await client.functions.sleep(100);
  } while(!client.readyAt)
  
  client.log(`Ready to serve in ${client.channels.cache.size} channels on ${client.guilds.cache.size} servers, for a total of ${client.guilds.cache.map(g => g.memberCount).reduce((a, c) => a + c)} users.\n`);
  console.timeEnd('Starting time')
}