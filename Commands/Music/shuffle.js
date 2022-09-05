module.exports = {
  name: 'shuffle',
  aliases: [],
  description: 'Shuffles the queue',
  permissions: { client: ['EmbedLinks'], user: [] },
  cooldowns: { client: 0, user: 0 },
  category: 'Music',
  needsQueue: true,

  run: async (player, _, { functions }) => {
    await player.queue.shuffle();
    functions.editPlayer(player, 'Shuffled the queue!', { asEmbed: true });
  }
}