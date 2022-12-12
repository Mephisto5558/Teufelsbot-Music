module.exports = {
  name: 'pause',
  aliases: ['resume'],
  description: 'pauses/resumes the player',
  cooldowns: { user: 2000 },
  requireQueue: true,

  run: async function () {
    await (this.musicPlayer.paused ? this.musicPlayer.resume() : this.musicPlayer.pause());
    this.sendEmbed(`Player ${this.musicPlayer.paused ? 'paused' : 'resumed'}`, { asEmbed: true });
  }
};