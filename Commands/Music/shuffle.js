const { Command } = require('reconlx');

module.exports = new Command({
  name: 'shuffle',
  description: 'Shuffles the queue',
  permissions: { client: [], user: [] },
  cooldown: { client: 0, user: 0 },
  category: 'Music',
  needsQueue: true,

  run: async player => {
    await player.queue.shuffle();

    editReply(player, 'Shuffled the queue!',  true );
  }
})