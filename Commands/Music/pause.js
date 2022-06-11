const { Command } = require('reconlx');

module.exports = new Command({
  name: 'pause',
  description: 'pauses the player',
  permissions: { client: [], user: [] },
  cooldown: { client: 0, user: 2000 },
  category: 'Music',

  run: async (client, interaction) => {
    const queue = client.musicPlayer.getQueue(interaction.guild.id);

    if (!queue?.songs) return interaction.editReply('There are no songs in the queue');
    else if (queue.paused) return interaction.editReply('The player is already paused');

    await queue.pause();
    interaction.editReply('Player paused');
  }
})