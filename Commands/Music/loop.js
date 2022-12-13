module.exports = {
  name: 'loop',
  aliases: ['repeat'],
  cooldowns: { user: 2000 },
  requireVC: true,
  requireQueue: true,
  options: [
    { name: 'song', type: 'Subcommand' },
    { name: 'queue', type: 'Subcommand' }
  ],

  run: async function (lang) {
    if (this.options.getSubcommand() == 'song') {
      await this.musicPlayer.setRepeatMode(this.musicPlayer.repeatMode == 0 ? 1 : 0);
      this.sendEmbed(lang(this.musicPlayer.repeatMode == 0 ? 'song.disabled' : 'song.enabled'), { asEmbed: true });
    }

    await this.musicPlayer.setRepeatMode(this.musicPlayer.repeatMode == 0 ? 2 : 0);
    this.sendEmbed(lang(this.musicPlayer.repeatMode == 0 ? 'queue.disabled' : 'queue.enabled'), { asEmbed: true });
  }
};