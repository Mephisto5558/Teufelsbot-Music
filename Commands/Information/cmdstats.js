const { EmbedBuilder, Colors } = require('discord.js');

module.exports = {
  name: 'cmdstats',
  cooldowns: { user: 1000 },
  dmPermission: true,
  options: [{
    name: 'command',
    type: 'String',
    autocomplete: true,
    autocompleteOptions: function () { return [...new Set([...this.client.prefixCommands.keys(), ...this.client.slashCommands.keys()])]; }
  }],

  run: function (lang) {
    const
      command = this.options.getString('command'),
      embed = new EmbedBuilder({
        title: lang('embedTitle'),
        color: Colors.White
      });

    if (command) {
      const id = this.client.application.commands.cache.find(e => e.name == command)?.id;
      embed.data.description = lang('embedDescriptionOne', { command: id ? `</${command}:id>` : `\`${command}\``, count: this.client.settings.stats?.[command] ?? 0 });
    }
    else {
      embed.data.description = lang('embedDescriptionMany');
      embed.data.fields = Object.entries(this.client.settings.stats || {})
        .sort(([, a], [, b]) => b - a).slice(0, 10).map(([k, v]) => {
          const id = this.client.application.commands.cache.find(e => e.name == k)?.id;
          return { name: id ? `</${k}:${id}>` : `/${k}`, value: `**${v}**`, inline: true };
        });
    }

    this.editReply({ embeds: [embed] });
  }
};