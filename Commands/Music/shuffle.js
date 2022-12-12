module.exports = {
  name: 'shuffle',
  description: 'Shuffles the queue',
  requireQueue: true,

  run: async function () {
    await this.musicPlayer.shuffle();
    this.sendEmbed('Shuffled the queue!', { asEmbed: true });
  }
}