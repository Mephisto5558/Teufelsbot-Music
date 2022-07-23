const { Command } = require('reconlx');

module.exports = new Command({
  name: 'skip',
  aliases: [],
  description: 'Skips the current song',
  permissions: { client: [], user: [] },
  cooldowns: { client: 0, user: 500 },
  category: 'Music',
  needsQueue: true,

  run: async player => await player.queue.skip()
})