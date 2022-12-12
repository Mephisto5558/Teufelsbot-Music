module.exports = {
  name: 'nowplaying',
  aliases: ['np'],
  description: 'Shows the currently playing song',
  requireQueue: true,

  run: function () {
    const
      { duration, name, url, user } = this.musicPlayer.songs[0],
      remainingTime = (duration - this.musicPlayer.currentTime).toFormattedTime();

    this.sendEmbed(`I am currently playing\n` +
      `[${name}](${url}) - \`${this.musicPlayer.formattedCurrentTime}\` / \`${remainingTime}\`\n` +
      `Requested by: ${user}`,
      { asEmbed: true }
    )
  }
}