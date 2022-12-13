module.exports = {
  name: 'skip',
  aliases: ['next'],
  description: 'Skips the current song',
  cooldowns: { user: 500 },
  requireQueue: true,
  options: [{ name: 'amount', type: 'Number' }],

  run: async function (lang) {
    const amount = this.options.getNumber('amount') || 0;

    if (!amount || amount == 1) {
      await this.musicPlayer.skip();
      return this.sendEmbed(lang('skippedToNext'), { asEmbed: true });
    }
    if (amount < 0) {
      if (!this.musicPlayer.previousSongs[Math.abs(amount)]) {
        await this.musicPlayer.jump(-this.musicPlayer.previousSongs.length);
        return this.sendEmbed(lang('skippedToFirst'), { asEmbed: true });
      }
      await this.musicPlayer.jump(amount);
      return this.sendEmbed(lang('skippedAmount', amount), { asEmbed: true });
    }

    if (!this.musicPlayer.songs[amount + 1]) {
      await this.musicPlayer.jump(this.musicPlayer.songs.length);
      return this.sendEmbed(lang('skippedToLast'), { asEmbed: true });
    }
    await this.musicPlayer.jump(amount);
    this.sendEmbed(lang('skippedAmount', amount), { asEmbed: true });
  }
};