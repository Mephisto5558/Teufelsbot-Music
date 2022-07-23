const { Command } = require('reconlx');

module.exports = new Command({
  name: 'shuffle',
  aliases: [],
  description: 'Shuffles the queue',
  permissions: { client: [], user: [] },
  cooldowns: { client: 0, user: 0 },
  category: 'Music',
  needsQueue: true,

  run: async player => {
    await player.queue.shuffle();
    client.functions.editPlayer(player, 'Shuffled the queue!', true);
  }
})