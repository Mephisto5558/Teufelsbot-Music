const { Command } = require('reconlx');

module.exports = new Command({
  name: 'clearqueue',
  aliases: [],
  description: 'Clear all songs from the queue',
  permissions: { client: [], user: [] },
  cooldowns: { client: 0, user: 5000 },
  category: 'Music',
  needsVC: true,
  needsQueue: true,

  run: async (player, _, { functions }) => {
    await player.queue.delete();
    functions.editPlayer(player, 'Queue cleared', true);
  }
})