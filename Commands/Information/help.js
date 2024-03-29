const
  { EmbedBuilder, Colors } = require('discord.js'),
  { I18nProvider, permissionTranslator } = require('../../Utils'),
  ownerOnlyFolders = require('../../config.json')?.ownerOnlyFolders?.map(e => e?.toLowerCase()) || ['owner-only'];

function listCommands(list, output, count, category) {
  for (const [, command] of list) {
    if (command.category?.toLowerCase() != category?.toLowerCase() || command.hideInHelp || command.disabled || output.includes(`\`${command.name}\``)) continue;

    if (!(count % 5)) output += `\`${command.name ?? command}\`\n> `;
    else output += `\`${command.name ?? command}\`, `;
    count++;
  }
  return [output, count];
}

module.exports = {
  name: 'help',
  cooldowns: { user: 50 },
  dmPermission: true,
  ephemeralDefer: true,
  options: [{
    name: 'command',
    type: 'String',
    autocomplete: true,
    autocompleteOptions: function () { return [...new Set(this.client.slashCommands.keys())]; }
  }], beta: true,

  run: function (lang) {
    const
      embed = new EmbedBuilder({ color: Colors.Blurple }),
      query = this.options.getString('command')?.toLowerCase()

    if (query) {
      const cmd = this.client.prefixCommands.get(query) || this.client.slashCommands.get(query);

      if (!cmd?.name || cmd.hideInHelp || cmd.disabled || (ownerOnlyFolders.includes(cmd.category.toLowerCase()) && this.user.id != this.client.application.owner.id)) {
        embed.data.description = lang('one.notFound', query);
        embed.data.color = Colors.Red;
      }
      else {
        const helpLang = I18nProvider.__.bind(I18nProvider, { undefinedNotFound: true, locale: this.guild.localeCode, backupPath: `commands.${cmd.category.toLowerCase()}.${cmd.name}` });

        embed.data.title = lang('one.embedTitle', cmd.name);
        embed.data.description = helpLang('description') ?? lang('one.noDescription');
        if (helpLang('usage')) embed.data.footer = { text: lang('one.embedFooterText') };
        embed.data.fields = [
          cmd.aliases?.length && { name: lang('one.alias'), value: `\`${listCommands(cmd.aliases.slash, '', 1)[0].replaceAll('> ', '')}\``, inline: true },
          cmd.permissions?.client?.length && { name: lang('one.botPerms'), value: `\`${permissionTranslator(cmd.permissions.client).join('`, `')}\``, inline: false },
          cmd.permissions?.user?.length && { name: lang('one.userPerms'), value: `\`${permissionTranslator(cmd.permissions.user).join('`, `')}\``, inline: true },
          (cmd.cooldowns?.user || cmd.cooldowns?.guild) && {
            name: lang('one.cooldowns'), inline: false,
            value: Object.entries(cmd.cooldowns).filter(([, e]) => e).map(([k, v]) => `${lang('global.' + k)}: \`${parseFloat((v / 1000).toFixed(2))}\`s`, '').join(', ')
          },
          helpLang('usage') && { name: lang('one.usage'), value: `${cmd.slashCommand ? lang('one.lookAtDesc') : ''} ${helpLang('usage') || ''}`, inline: false }
        ].filter(Boolean);
      }

      return this.editReply({ embeds: [embed] });
    }

    embed.data.title = lang('all.embedTitle');
    embed.setThumbnail(this.guild.members.me.displayAvatarURL());

    for (const category of getDirectoriesSync('./Commands').map(e => e.toUpperCase())) {
      if (ownerOnlyFolders.includes(category.toLowerCase()) && this.user.id != this.client.application.owner.id) continue;

      let data = listCommands(this.client.prefixCommands, '', 1, category);
      data = listCommands(this.client.slashCommands, data[0], data[1], category);

      if (data[1] == 1) continue;

      let cmdList = data[0];

      if (cmdList.endsWith('\n> ')) cmdList = cmdList.slice(0, -4);
      if (cmdList.endsWith(', ')) cmdList = cmdList.slice(0, -2);
      if (!cmdList.endsWith('`')) cmdList += '`';

      if (cmdList) embed.addFields([{ name: `**${category} [${data[1] - 1}]**`, value: `> ${cmdList}\n`, inline: true }]);
    }

    if (!embed.data.fields) embed.data.description = lang('all.notFound');
    else embed.data.footer = { text: lang('all.embedFooterText') };

    this.editReply({ embeds: [embed] });
  }
};