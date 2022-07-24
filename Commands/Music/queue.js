const
  { Command } = require('reconlx'),
  { EmbedBuilder, Colors } = require('discord.js');

module.exports = new Command({
  name: 'queue',
  aliases: [],
  description: 'Shows the queue',
  permissions: { client: [], user: [] },
  cooldowns: { client: 0, user: 2000 },
  category: 'Music',
  needsQueue: true,

  run: async (player, _, { functions }) => {
    const song = player.queue.songs[0];
    const remainingSongTime = (song.duration - player.queue.currentTime).toFormattedTime();

    let description = player.queue.songs.map(({ name, url, formattedDuration }, i) => `**${i}**. [${name.length <= 75 ? name : name.substring(0, 75) + '...'}](${url}) \`[${formattedDuration}]\``).join('\n');

    if (description.length > 4096) description = description.substring(0, description.substring(0, 4096).lastIndexOf('\n**')) + '\n**...**';

    const embed = new EmbedBuilder({
      title: 'Queue',
      description: description,
      colors: Colors.Blurple,
      fields: [
        { name: 'Current Song', value: `[${song.name.length < 76 ? song.name : song.name.substring(0, 75) + '...'}](${song.url}) by ${song.uploader.name} \`${player.queue.formattedCurrentTime}\` / \`${remainingSongTime}\``, inline: false },
        { name: 'Queue Length', value: `\`${player.queue.songs.length}\` songs, \`${player.queue.formattedDuration}\``, inline: true }
      ]
    });

    functions.editPlayer(player, { embeds: [embed] });
  }
})