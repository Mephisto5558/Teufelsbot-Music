const { Command } = require('reconlx');

module.exports = new Command({
  name: 'pause',
  aliases: ['resume'],
  description: 'pauses/resumes the player',
  permissions: { client: ['EmbedLinks'], user: [] },
  cooldowns: { client: 0, user: 2000 },
  category: 'Music',
  needsQueue: true,

  run: async (player, _, { functions }) => {
    player.queue.paused ? await player.queue.resume() : await player.queue.pause();

    functions.editPlayer(player, `Player ${player.queue.paused ? 'paused' : 'resumed'}`, { asEmbed: true });
  }
})