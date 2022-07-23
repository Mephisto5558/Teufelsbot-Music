const { Command } = require('reconlx');

module.exports = new Command({
  name: 'clearqueue',
  aliases: [],
  description: 'Clear all songs from the queue',
  permissions: { client: [], user: [] },
  cooldowns: { client: 0, user: 5000 },
  category: 'Music',
  needsQueue: true,

  run: async player => {
    await player.queue.delete();
   client.functions.editPlayer(player, 'Queue cleared', true);
  }
})