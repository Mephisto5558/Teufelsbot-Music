module.exports = {
  name: 'stop',
  aliases: [],
  description: 'Stop the player',
  permissions: { client: [], user: [] },
  cooldowns: { client: 0, user: 2000 },
  category: 'Music',
  needsQueue: true,

  run: async function (player) {
    await player.queue.stop();
    this.editPlayer('Player stopped', { asEmbed: true });
  }
}