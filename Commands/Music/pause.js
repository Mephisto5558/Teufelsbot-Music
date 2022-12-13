module.exports = {
  name: 'pause',
  aliases: ['resume'],
  cooldowns: { user: 2000 },
  requireQueue: true,

  run: async function (lang) {
    await (this.musicPlayer.paused ? this.musicPlayer.resume() : this.musicPlayer.pause());
    this.sendEmbed(lang(this.musicPlayer.paused ? 'paused' : 'resumed'), { asEmbed: true });
  }
};