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

    let description = player.queue.songs.map((song, index) => {
      if (!index) return;
      return `**${index}**. [${song.name.length <= 75 ? song.name : song.name.substring(0, 75) + '...'}](${song.url}) \`[${song.formattedDuration}]\``;
    }).join('\n');

    if (description.length > 4096) description = description.substring(0, description.substring(0, 4096).lastIndexOf('\n**')) + '\n...';

    const embed = new MessageEmbed()
      .setTitle('Queue')
      .setDescription(description)
      .addField('Current Song', `[${song.name.length <= 75 ? song.name : song.name.substring(0, 75) + '...'}](${song.url}) by ${song.uploader.name} \`${player.queue.formattedCurrentTime}\` / \`${remainingSongTime}\``)
      .addField('Queue Length', `${player.queue.songs.length} songs, ${player.queue.formattedDuration}`, true)
      .addField('Autoplay', player.queue.autoplay ? 'On' : 'Off', true)
      .setColor(colors.discord.BURPLE);

    await editReply(player, { embeds: [embed] });
  }
})