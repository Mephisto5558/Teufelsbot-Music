const { Command } = require('reconlx');

module.exports = new Command({
  name: 'skip',
  description: 'Skips the current song',
  permissions: { client: [], user: [] },
  cooldown: { client: 0, user: 500 },
  category: 'Music',

  run: async (client, interaction) => {
    const queue = client.musicPlayer.getQueue(interaction.guild.id);

    if (!queue?.songs) return interaction.editReply('There are no Songs in the queue!');

    await queue.skip();
    interaction.editReply('Song skiped');
  }
})