module.exports = {
  name: 'loop',
  aliases: ['repeat'],
  description: 'Loop a song or the whole queue',
  cooldowns: { user: 2000 },
  requireVC: true,
  requireQueue: true,
  options: [
    {
      name: 'song',
      description: 'loop the currently playing song',
      type: 'Subcommand'
    },
    {
      name: 'queue',
      description: 'loop the current queue',
      type: 'Subcommand'
    }
  ],

  run: async function () {
    const cmd = this.options.getSubcommand();
    const repeatMode = cmd == 'song' ? [1, 'Enabled song'] : [2, 'Enabled queue'];

    await this.musicPlayer.setRepeatMode(this.musicPlayer.repeatMode > 0 ? 0 : repeatMode[0]);
    this.sendEmbed(`${player.queue.repeatMode == 0 ? 'Disabled' : repeatMode[1]} loop.`, { asEmbed: true });
  }
}