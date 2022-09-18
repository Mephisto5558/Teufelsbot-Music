module.exports = {
  name: 'pause',
  aliases: ['resume'],
  description: 'pauses/resumes the player',
  permissions: { client: ['EmbedLinks'], user: [] },
  cooldowns: { client: 0, user: 2000 },
  category: 'Music',
  needsQueue: true,

  run: async function (player) {
    player.queue.paused ? await player.queue.resume() : await player.queue.pause();

    this.editPlayer(`Player ${player.queue.paused ? 'paused' : 'resumed'}`, { asEmbed: true });
  }
}