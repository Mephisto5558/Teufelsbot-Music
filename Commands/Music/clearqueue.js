const { Command } = require('reconlx');

module.exports = new Command({
  name: 'clearqueue',
  description: 'Clear all songs from thr queue',
  permissions: { client: [], user: [] },
  cooldown: { client: 0, user: 5000 },
  category: 'Music',
  needsQueue: true,

  run: async player => {
    await player.queue.delete();
    editReply(player, 'Queue cleared',  true );
  }
})