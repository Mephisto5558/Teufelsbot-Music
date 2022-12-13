module.exports = {
  name: 'stop',
  aliases: ['clearqueue'],
  cooldowns: { guild: 2000 },
  requireQueue: true,

  run: async function (lang) {
    await this.musicPlayer.stop();
    this.sendEmbed(lang('success'), { asEmbed: true });
  }
};