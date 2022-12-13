module.exports = {
  name: 'volume',
  cooldowns: { user: 500 },
  requireVC: true,
  requireQueue: true,
  options: [{
    name: 'volume',
    type: 'Number',
    required: true,
    minValue: 0,
    maxValue: 500
  }],

  run: async function (lang) {
    const volume = this.options.getNumber('volume');

    await this.musicPlayer.setVolume(volume);
    this.sendEmbed(lang('success', volume), { asEmbed: true });
  }
};