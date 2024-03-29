const
  { EmbedBuilder, Colors } = require('discord.js'),
  { readFileSync } = require('fs'),
  { Invite, Dashboard, PrivacyPolicy } = require('../../config.json').Website;

module.exports = {
  name: 'info',
  cooldowns: { user: 50 },
  dmPermission: true,

  run: function (lang) {
    const
      startTime = Math.round(Date.now() / 1000 - process.uptime()),
      startCount = readFileSync('./Logs/startCount.log', 'utf8') || 0,
      owner = this.client.application.owner.owner || this.client.application.owner,
      description =
        `${lang('dev')}: [${owner.tag}](https://discord.com/users/${owner.id})\n` +
        `${lang('shard')}: \`${this.guild.shardId}\`\n` +
        `${lang('global.guild')}: \`${this.guild.db.position ?? 0}\`\n` +
        `${lang('commands')}: \`${new Set(this.client.slashCommands.filter(e => !e.aliasOf)).size}\`\n` +
        `${lang('starts')}: \`${startCount}\`\n` +
        `${lang('lastStart')}: <t:${startTime}> (<t:${startTime}:R>)\n` +
        lang('translation', { de: '[.̔̏𝗠𝗲𝗽𝗵𝗶𝘀𝘁𝗼#5558](https://discord.com/users/691550551825055775) & [Leoooooooo#9125](https://discord.com/users/740930989798195253)', en: '[.̔̏𝗠𝗲𝗽𝗵𝗶𝘀𝘁𝗼#5558](https://discord.com/users/691550551825055775)' }) +
        lang('links', { Invite, Dashboard, PrivacyPolicy }),

      embed = new EmbedBuilder({
        title: lang('embedTitle'),
        description: description,
        color: Colors.DarkGold,
        footer: { text: lang('embedFooterText') }
      });

    this.editReply({ embeds: [embed] });
  }
};