const { Command } = require('reconlx');

module.exports = new Command({
  name: 'pause',
  aliases: ['resume'],
  description: 'pauses/resumes the player',
  permissions: { client: [], user: [] },
  cooldown: { client: 0, user: 2000 },
  category: 'Music',
  needsQueue: true,

  run: async (player) => {
    if (player.queue.paused) {
      await player.queue.resume();
      editReply(player, 'Player resumed',  true );
    }
    else {
      await player.queue.pause();
      editReply(player, 'Player paused',  true );
    }
  }
})