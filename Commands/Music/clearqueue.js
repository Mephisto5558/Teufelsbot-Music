module.exports = {
  name: 'clearqueue',
  aliases: [],
  description: 'Clear all songs from the queue',
  permissions: { client: ['EmbedLinks'], user: [] },
  cooldowns: { client: 0, user: 5000 },
  category: 'Music',
  needsVC: true,
  needsQueue: true,

  run: async function (player) {
    await player.queue.delete();
    this.editPlayer('Queue cleared', { asEmbed: true });
  }
}