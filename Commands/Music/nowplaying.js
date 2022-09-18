module.exports = {
  name: 'nowplaying',
  aliases: ['np'],
  description: 'Shows the currently playing song',
  permissions: { client: ['EmbedLinks'], user: [] },
  cooldowns: { global: '', user: '' },
  category: 'Music',
  needsQueue: true,

  run: function (player) {
    const
      { duration, name, url, user } = player.queue.songs[0],
      remainingTime = (duration - player.queue.currentTime).toFormattedTime();

    this.editPlayer(`I am currently playing\n` +
      `[${name}](${url}) \`${player.queue.formattedCurrentTime}\` / \`${remainingTime}\`\n` +
      `Requested by: ${user}`,
      { asEmbed: true }
    )
  }
}