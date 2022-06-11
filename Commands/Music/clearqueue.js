const { Command } = require('reconlx');

module.exports = new Command({
  name: 'clearqueue',
  description: 'Clear all songs from thr queue',
  permissions: { client: [], user: [] },
  cooldown: { client: 0, user: 5000 },
  category: 'Music',

  run: async (_, interaction) => {
    const queue = client.musicPlayer.getQueue(interaction.guild.id);

    if (queue.songs) await queue.delete();
    interaction.editReply('Queue cleared');
  }
})