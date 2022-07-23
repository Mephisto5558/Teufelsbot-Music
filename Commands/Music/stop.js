const { Command } = require('reconlx');

module.exports = new Command({
  name: 'stop',
  aliases: [],
  description: 'Stop the player',
  permissions: { client: [], user: [] },
  cooldowns: { client: 0, user: 2000 },
  category: 'Music',
  needsQueue: true,

  run: async player => {
    await player.queue.stop();
    client.functions.editPlayer(player, 'Player stopped', true);
  }
})