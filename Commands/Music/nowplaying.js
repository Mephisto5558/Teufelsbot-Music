const { Command } = require('reconlx');

module.exports = new Command({
  name: 'nowplaying',
  aliases: ['np'],
  description: 'Shows the currently playing song',
  permissions: { client: [], user: [] },
  cooldowns: { global: '', user: '' },
  category: 'Music',
  needsQueue: true,

  run: async (player, _, { functions }) => {
    const
      { duration, name, url, user } = player.queue.songs[0],
      remainingTime = (duration - player.queue.currentTime).toFormattedTime();

    await functions.editPlayer(player,
      `I am currently playing\n` +
      `[${name}](${url}) \`${player.queue.formattedCurrentTime}\` / \`${remainingTime}\`\n` +
      `Requested by: ${user}`,
      { asEmbed: true }
    )
  }
})