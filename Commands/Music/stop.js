const { Command } = require('reconlx');

module.exports = new Command({
  name: 'stop',
  description: 'Stop the player',
  permissions: { client: [], user: [] },
  cooldown: { client: 0, user: 2000 },
  category: 'Music',
  needsQueue: true,

  run: async player => {    
    await player.queue.stop();
    await editReply(player, 'Player stopped',  true );
  }
})