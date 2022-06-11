const { Command } = require('reconlx');

module.exports = new Command({
  name: 'stop',
  description: 'Stop a Song',
  permissions: { client: [], user: [] },
  cooldown: { client: 0, user: 2000 },
  category: 'Music',

  run: async (client, interaction) => {
    const queue = client.musicPlayer.getQueue(interaction.guild.id);

    if (!queue.songs) return interaction.editReply('There are no songs in the queue!')

    await queue.stop();
    interaction.editReply('Player stopped');
  }
})