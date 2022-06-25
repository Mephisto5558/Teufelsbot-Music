const { Command } = require('reconlx');

module.exports = new Command({
  name: 'nowplaying',
  aliases: ['np'],
  description: 'Shows the currently playing song',
  permissions: { client: [], user: [] },
  cooldowns: { global: '', user: '' },
  category: 'Music',
  needsQueue: true,

  run: async player => {
    const
      song = player.queue.songs[0],
      remainingTime = Number.prototype.toFormattedTime(player.queue.duration - player.queue.currentTime);

    await editReply(player,
      `I am currently playing\n` +
      `[${song.name}](${song.url}) \`${player.queue.formattedCurrentTime}\` / \`${remainingTime}\`\n` +
      `Requested by: ${song.user}`,
      true
    )
  }
})