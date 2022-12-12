module.exports = {
  name: 'stop',
  description: 'Stop the player',
  cooldowns: { guild: 2000 },
  requireQueue: true,

  run: async function () {
    await this.musicPlayer.stop();
    this.sendEmbed('Player stopped & Queue cleared', { asEmbed: true });
  }
}