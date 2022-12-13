module.exports = {
  name: 'shuffle',
  requireQueue: true,

  run: async function (lang) {
    await this.musicPlayer.shuffle();
    this.sendEmbed(lang('success'), { asEmbed: true });
  }
};