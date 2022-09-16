const { EmbedBuilder, Colors } = require('discord.js');

function listCommands(list, output, count, category) {
  for (const command of list.values()) {
    if (command.category.toLowerCase() != category?.toLowerCase() || command.hideInHelp || command.disabled || output.includes(`\`${command.name}\``)) continue;

    if (count % 5 == 0) output += `\`${command.name}\`\n> `
    else output += `\`${command.name}\`, `
    count++
  }
  return [output, count];
}

module.exports = {
  name: 'help',
  aliases: [],
  description: 'Shows all bot commands',
  permissions: { client: ['EmbedLinks'], user: [] },
  cooldowns: { guild: 0, user: 50 },
  category: 'Information',
  ephemeralDefer: true,
  options: [{
    name: 'command',
    description: 'Type a command here to get more information about it',
    type: 'String',
    required: false
  }],

  run: (_, interaction, client) => {
    const query = interaction.options?.getString('command')?.toLowerCase();
    const embed = new EmbedBuilder({ color: Colors.Blurple });

    if (query) {
      const cmd = client.commands.get(query);

      if (!cmd?.name || cmd.hideInHelp || cmd.disabled || cmd.category.toLowerCase() == 'owner-only') {
        embed.data.description = `No Information found for command \`${query}\``;
        embed.data.color = Colors.Red;
      }
      else {
        embed.data.title = `Detailed Information about: \`${cmd.name}\``;
        embed.data.description = cmd.description ?? 'No description found';
        embed.data.fields = [
          cmd.aliases?.length ? { name: 'Command Aliases', value: `\`${listCommands(cmd.aliases, '', 1)[0].replace(/> /g, '')}\``, inline: true } : null,
          cmd.permissions?.client?.length ? { name: 'Required Bot Permissions', value: `\`${cmd.permissions.client.join('`, `')}\``, inline: false } : null,
          cmd.permissions?.user?.length ? { name: 'Required User Permissions', value: `\`${cmd.permissions.user.join('`, `')}\``, inline: true } : null,
          cmd.cooldowns?.guild || cmd.cooldowns?.user ? {
            name: 'Command Cooldowns', inline: false, value:
              (cmd.cooldowns.guild ? `Guild: \`${parseFloat((cmd.cooldowns.guild / 1000).toFixed(2))}\`s${cmd.cooldowns.user ? ', ' : ''}` : '') +
              (cmd.cooldowns.user ? `User: \`${parseFloat((cmd.cooldowns.user / 1000).toFixed(2))}\`s` : '')
          } : null,
          cmd.usage ? { name: 'Usage', value: `${cmd.slashCommand ? 'Look at the option descriptions.\n' : ''} ${cmd.usage || ''}`, inline: false } : null
        ].filter(Boolean);
      }

      return interaction.editReply({ embeds: [embed] })
    }

    embed.data.title = `🔰All my commands`;
    embed.setThumbnail(client.user.displayAvatarURL());

    for (const category of client.categories.map(e => e.toUpperCase())) {
      if (category == 'OWNER-ONLY') continue;

      const data = listCommands(client.commands, '', 1, category);

      if (data[1] == 1) continue;

      let cmdList = data[0];

      if (cmdList.endsWith('\n> ')) cmdList = cmdList.slice(0, -4);
      if (cmdList.endsWith(', ')) cmdList = cmdList.slice(0, -2);
      if (!cmdList.endsWith('`')) cmdList += '`';

      if (cmdList) embed.addFields([{ name: `**${category} [${data[1] - 1}]**`, value: `> ${cmdList}\n`, inline: true }]);
    }

    if (!embed.data.fields) embed.data.description = 'No commands found...';
    else embed.data.footer = { text: `Use the 'command' option to get more information about a specific command.` };

    interaction.editReply({ embeds: [embed] });
  }
}