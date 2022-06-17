const
  { Command } = require('reconlx'),
  { MessageEmbed } = require('discord.js'),
  { colors } = require('../../Settings/embed.json');

module.exports = new Command({
  name: 'queue',
  description: 'Shows the queue',
  permissions: { client: [], user: [] },
  cooldown: { client: 0, user: 2000 },
  category: 'Music',
  needsQueue: true,

  run: async player => {
    const song = player.queue.songs[0];
    remainingSongTime = Number.prototype.toFormattedTime(player.queue.duration - player.queue.currentTime);

    const description = player.queue.songs.map((song, index) => {
      return `\`${index + 1}.\` **[${song.name}](${song.url})** \`[${song.formattedDuration}]\``;
    }).join('\n');

    const embed = new MessageEmbed()
      .setTitle('Queue')
      .setDescription(description.substring(0, 4096))
      .addField('Current Song', `[${song.name}](${song.url}) by ${song.uploader.name} \`${player.queue.formattedCurrentTime}\` / \`${remainingTime}\``)
      .addField('Queue Length', player.queue.formattedDuration)
      .setColor(colors.discord.BURPLE);

    editReply(player, { embeds: [embed] });
  }
})