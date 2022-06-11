const { Command } = require('reconlx');

module.exports = new Command({
  name: 'leave',
  description: 'Leave the current voice channel',
  permissions: { client: [], user: [] },
  cooldown: { client: 0, user: 3000},
  category: 'Music',

  run: async (_, interaction) => {
    if (!interaction.guild.me.voice) return interaction.editReply(`I'm currently not connected to a voice channel.`);

    await interaction.guild.me.voice.disconnect();
    interaction.editReply('left the voice channel');
  }
})