module.exports = {
  name: 'clearqueue',
  description: 'Clear all songs from the queue',
  cooldowns: { user: 5000 },
  requireVC: true,
  requireQueue: true,

  run: async function () {
    await this.musicPlayer.queue.stop();
    this.sendEmbed('Queue cleared', { asEmbed: true });
  }
}