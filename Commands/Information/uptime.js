const
  { EmbedBuilder, Colors } = require('discord.js'),
  { Domain } = require('../../config.json').Website,
  { uptime } = require('../../Utils');

module.exports = {
  name: 'uptime',
  cooldowns: { user: 100 },
  dmPermission: true,

  run: function (lang) {
    const embed = new EmbedBuilder({
      description: lang('embedDescription', { time: uptime(true, lang).formatted, Domain }),
      color: Colors.White
    });

    this.editReply({ embeds: [embed] });
  }
};