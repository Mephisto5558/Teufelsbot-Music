const
  { Command } = require('reconlx'),
  { MessageEmbed } = require('discord.js'),
  { colors } = require('../../Settings/embed.json');

module.exports = new Command({
  name: 'help',
  aliases: [],
  description: 'Shows all bot commands',
  permissions: { client: [], user: [] },
  cooldowns: { global: '', user: '' },
  category: 'Information',
  ephemeralDefer: true,
  options: [{
    name: 'command',
    description: 'Type a command here to get more information about it',
    type: 'STRING',
    required: false
  }],

  run: (_, interaction, client) => {
    const query = interaction.options?.getString('command')?.toLowerCase();

    let embed = new MessageEmbed({
      color: colors.discord.BURPLE
    });

    if (query) {
      const cmd = client.slashCommands.get(query);

      if (!cmd?.name || cmd.hideInHelp || cmd.disabled || cmd.category.toUpperCase() == 'OWNER-ONLY') {
        embed
          .setDescription(`No Information found for command \`${query}\``)
          .setColor(colors.RED);
      }
      else {
        if (cmd.name) embed.title = `Detailed Information about: \`${cmd.name}\``;
        if (cmd.description) embed.description = cmd.description;
        if (cmd.aliases?.length) embed.addField('Aliases', `\`${listCommands(cmd.aliases, '', 1).replace(/> /g, '')}\``);
        if (cmd.usage) embed.addField('Usage', `${cmd.slashCommand ? 'SLASH Command: look at the option descriptions.\n' : ''} ${cmd.usage || ''}`);

        embed.footer = { text: 'Syntax: <> = required, [] = optional' };
      }

      return interaction.editReply({ embeds: [embed] });
    }

    embed.title = `🔰All my commands`;
    embed.setThumbnail(client.user.displayAvatarURL({ dynamic: true }));

    let cmdList = '';

    for (let i = 0; i < client.categories.length; i++) {
      const category = client.categories[i].toUpperCase();
      if (category == 'OWNER-ONLY') continue;

      let a = 0;
      for (let command of client.slashCommands) {
        command = command[1];
        if (command.category.toUpperCase() != category.toUpperCase() || command.hideInHelp || command.disabled || output.includes(`\`${command.name}\``)) continue;

        if (a % 5 == 0) cmdList += `\`${command.name}\`\n> `
        else cmdList += `\`${command.name}\`, `
        i++
      }

      if (a == 1) continue;

      if (cmdList.endsWith('\n> ')) cmdList = cmdList.slice(0, -4);
      if (cmdList.endsWith(', ')) cmdList = cmdList.slice(0, -2);

      embed.addField(`**${category} [${i - 1}]**`, `> ${cmdList}\n`);
    }

    if (!embed.fields) embed.description = 'No commands found...';
    else embed.footer = { text: `Use the 'command' option to get more information about a specific command.` };

    interaction.editReply({ embeds: [embed] });

  }
})