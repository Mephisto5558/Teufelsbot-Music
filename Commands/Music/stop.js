const { Command } = require('reconlx');

module.exports = new Command({
  name: 'stop',
  aliases: [],
  description: 'Stop the player',
  permissions: { client: ['EmbedLinks'], user: [] },
  cooldowns: { client: 0, user: 2000 },
  category: 'Music',
  needsQueue: true,

  run: async (player, _, { functions }) => {
    await player.queue.stop();
    functions.editPlayer(player, 'Player stopped', { asEmbed: true });
  }
})