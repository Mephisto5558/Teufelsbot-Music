module.exports = {
  name: 'shuffle',
  aliases: [],
  description: 'Shuffles the queue',
  permissions: { client: ['EmbedLinks'], user: [] },
  cooldowns: { client: 0, user: 0 },
  category: 'Music',
  needsQueue: true,

  run: async function (player) {
    await player.queue.shuffle();
    this.editPlayer('Shuffled the queue!', { asEmbed: true });
  }
}