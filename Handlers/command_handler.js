const
  { Collection, ApplicationCommandType, ApplicationCommandOptionType, PermissionsBitField, ChannelType } = require('discord.js'),
  { readdirSync } = require('fs'),
  event = require('../Events/interactionCreate.js');

let deletedCommandCount = 0;

function equal(a, b) {
  if (!a?.toString() && !b?.toString()) return true;
  if (typeof a == 'string' || typeof b == 'string') return a == b;
  if (
    a.name != b.name || a.description != b.description || a.type != b.type || a.autocomplete != b.autocomplete ||
    a.value != b.value || (a.options?.length ?? 0) != (b.options?.length ?? 0) || (a.channelTypes?.length ?? 0) != (b.channelTypes?.length ?? 0) ||
    a.minValue != b.minValue || a.maxValue != b.maxValue || !!a.required != !!b.required || !equal(a.choices, b.choices) ||
    a.defaultMemberPermissions?.bitfield != b.defaultMemberPermissions?.bitfield
  ) return;

  for (let i = 0; i < (a.options?.length || 0); i++) if (!equal(a.options?.[i], b?.options?.[i])) return;
  for (let i = 0; i < (a.channelTypes?.length || 0); i++) if (!equal(a.channelTypes?.[i], b.channelTypes?.[i])) return;

  return true;
}

function format(option) {
  if (option.options) option.options = option.options.map(e => format(e));
  if (option.run) {
    if (!option.type) option.type = ApplicationCommandType.ChatInput;
    else if (!ApplicationCommandType[option.type]) throw new Error(`Invalid option.type, got ${option.type}`);
    else if (isNaN(option.type)) option.type = ApplicationCommandType[option.type];

    if (option.permissions?.user.length) option.defaultMemberPermissions = new PermissionsBitField(option.permissions?.user);

    return option;
  }

  option.channelTypes = option.channelTypes?.map(e => {
    if (!ChannelType[e] && ChannelType[e] != 0) throw Error(`Invalid option.channelType, got ${e}`);
    return isNaN(e) ? ChannelType[e] : e;
  });

  if (!option.type || !ApplicationCommandOptionType[option.type]) throw Error(`Missing or invalid option.type, got ${option.type}`);
  if (isNaN(option.type)) option.type = ApplicationCommandOptionType[option.type];

  return option;
}

module.exports = async function commandHandler(SyncGuild) {
  await this.functions.ready();

  this.commands = new Collection();

  const skippedCommands = new Collection();
  const applicationCommands = await this.application.commands.fetch(undefined, { guildId: SyncGuild && SyncGuild != '*' ? SyncGuild : undefined });

  if (!SyncGuild || SyncGuild == '*') {
    for (const subFolder of getDirectoriesSync('./Commands')) {
      for (const file of readdirSync(`./Commands/${subFolder}`).filter(e => e.endsWith('.js'))) {
        const command = format(require(`../Commands/${subFolder}/${file}`));
        let skipped = false;

        if (command.disabled || (this.botType == 'dev' && !command.beta))
          continue;

        for (const applicationCommand of applicationCommands) {
          if (!equal(command, applicationCommand[1]))
            continue;
          this.log(`Skipped Slash Command ${command.name}`);
          skipped = true;
          skippedCommands.set(command.name, command);
          break;
        }
        if (!skipped) {
          this.commands.set(command.name, command);
          for (const alias of command.aliases)
            this.commands.set(alias, command);
        }
      }
    }

    for (const guild of await this.guilds.fetch()) {
      await this.application.commands.set([], guild[0]);
      this.log(`Cleared Slash Commands for Guild ${guild[0]}`);
    }
  }

  for (const command of this.commands) {
    await this.application.commands.create(command[1], SyncGuild && SyncGuild != '*' ? SyncGuild : null);
    this.log(`Registered Slash Comand ${command[0]}`);
  }

  const commandNames = [...this.commands, ...skippedCommands].map(e => e[0]);
  for (const clientCommand of applicationCommands) {
    if (commandNames.includes(clientCommand[1].name))
      continue;

    await this.application.commands.delete(clientCommand[1], SyncGuild && SyncGuild != '*' ? SyncGuild : null);
    this.log(`Deleted Slash Comand ${clientCommand[1].name}`);
    deletedCommandCount++;
  }

  if (SyncGuild)
    return;

  this.log(`Registered ${this.commands.size} Slash Commands`);

  skippedCommands.forEach((v, k) => this.commands.set(k, v));

  this.log(`Skipped ${skippedCommands.size} Slash Commands`);
  this.log(`Deleted ${deletedCommandCount} Slash Commands`);

  this.on('interactionCreate', event.bind(null, this));
  this.log('Loaded Event interactionCreate');
  this.log('Ready to receive slash commands\n');

  this.log(`Ready to serve in ${this.channels.cache.size} channels on ${this.guilds.cache.size} servers, for a total of ${new Set(this.guilds.cache.map(g => Array.from(g.members.cache.filter(e => !e.user.bot).keys())).flat()).size} unique users.\n`);
  console.timeEnd('Starting time');
}