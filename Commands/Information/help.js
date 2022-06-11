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

  run: (client, interaction) => {
     const query = interaction.options?.getString('command')?.toLowerCase();

    let embed = new MessageEmbed().setColor(colors.discord.BURPLE);

    if (query) {
      const cmd = client.slashCommands.get(query);

      if (!cmd?.name || cmd.hideInHelp || cmd.disabled || cmd.category.toUpperCase() == 'OWNER-ONLY') {
        embed
          .setDescription(`No Information found for command \`${query}\``)
          .setColor(colors.RED);
      }
      else {
        if (cmd.name) embed.setTitle(`Detailed Information about: \`${cmd.name}\``);
        if (cmd.description) embed.setDescription(cmd.description);
        if (cmd.aliases?.length) embed.addField('Aliases', `\`${listCommands(cmd.aliases, '', 1).replace(/> /g, '')}\``);
        if (cmd.usage) embed.addField('Usage', `${cmd.slashCommand ? 'SLASH Command: look at the option descriptions.\n' : ''} ${cmd.usage || ''}`);

        embed.setFooter({ text: 'Syntax: <> = required, [] = optional' });
      }

      return interaction.editReply({ embeds: [embed] });
    }

    embed
      .setTitle(`🔰All my commands`)
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true }));

      let cmdList = '';

    for (let i = 0; i < client.categories.length; i++) {
      const category = client.categories[i].toUpperCase();
      if (category == 'OWNER-ONLY') continue;

      for (let command of client.slashCommands) {
        i = 0;
        command = command[1];
        if (command.category.toUpperCase() != category.toUpperCase() || command.hideInHelp || command.disabled) continue;
    
        if (i % 5 == 0) cmdList += `\`${command.name}\`\n> `
        else cmdList += `\`${command.name}\`, `
        i++
      }

      if (i == 1) continue;

      if (cmdList.endsWith(', ')) cmdList = cmdList.slice(0, -2);
      
      embed.addField(`**${category} [${i - 1}]**`, `> ${cmdList}\n`);
    }

    if (!embed.fields) embed.setDescription('No commands found...');
    else embed.setFooter({ text: `Use the 'command' option to get more information about a specific command.` });

    interaction.editReply({ embeds: [embed] });

  }
})