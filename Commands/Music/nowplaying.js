module.exports = {
  name: 'nowplaying',
  aliases: ['np'],
  requireQueue: true,

  run: function (lang) {
    const
      { duration, name, url, user } = this.musicPlayer.songs[0],
      remainingTime = (duration - this.musicPlayer.currentTime).toFormattedTime();

    this.sendEmbed(
      lang('response', { user, data: `[${name}](${url}) - \`${this.musicPlayer.formattedCurrentTime}\` / \`${remainingTime}\`` }),
      { asEmbed: true }
    );
  }
};