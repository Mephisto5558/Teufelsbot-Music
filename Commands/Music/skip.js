module.exports = {
  name: 'skip',
  aliases: ['next'],
  description: 'Skips the current song',
  cooldowns: { user: 500 },
  requireQueue: true,
  options: [{
    name: 'amount',
    description: 'how much songs do you want to skip? You can use negative numbers to go to a previous song.',
    type: 'Number'
  }],

  run: async function () {
    const amount = this.options.getNumber('amount') || 0;

    if (!amount || amount == 1) {
      await this.musicPlayer.skip();
      return this.sendEmbed('Skipped to the next song.', { asEmbed: true });
    }
    if (amount < 0) {
      if (!this.musicPlayer.previousSongs[Math.abs(amount)]) {
        await this.musicPlayer.jump(-this.musicPlayer.previousSongs.length);
        return this.sendEmbed('Skipped to the first song.', { asEmbed: true });
      }
      await this.musicPlayer.jump(amount);
      return this.sendEmbed(`Skipped ${amount} songs.`, { asEmbed: true });
    }

    if (!this.musicPlayer.songs[amount + 1]) {
      await this.musicPlayer.jump(this.musicPlayer.songs.length);
      return this.sendEmbed('Skipped to the last song.', { asEmbed: true });
    }
    await this.musicPlayer.jump(amount);
    this.sendEmbed(`Skipped ${amount} songs.`, { asEmbed: true });
  }
};