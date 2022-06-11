const
  { Command } = require('reconlx'),
  { MessageEmbed } = require('discord.js');

module.exports = new Command({
  name: 'queue',
  description: 'Shows the queue',
  permissions: { client: [], user: [] },
  cooldown: { client: 0, user: 2000 },
  category: 'Music',

  run: async (client, interaction) => {
    const queue = client.musicPlayer.getQueue(interaction.guild.id);
    if (!queue?.songs) return interaction.editReply('There are no songs in the queue!')

    const description = queue.songs.map((song, index) => {
      return `\`${index + 1}.\` **[${song.name}](${song.url})** \`[${song.formattedDuration}]\``;
    }).join('\n');

    const embed = new MessageEmbed()
      .setTitle('Queue')
      .setDescription(description.substring(0, 4096))
      .addField('Queue Length', queue.songs.formattedDuration || '0:00', true)
      .addField('Current Song', queue.songs[0], true);

    interaction.editReply({ embeds: [embed] });
  }
})