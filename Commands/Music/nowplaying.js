const
  { Command } = require('reconlx'),
  { MessageEmbed } = require('discord.js'),
  { colors } = require('../../Settings/embed.json');

module.exports = new Command({
  name: 'nowplaying',
  aliases: ['np'],
  description: 'Shows the currently playing song',
  permissions: { client: [], user: [] },
  cooldowns: { global: '', user: '' },
  category: 'Music',
  ephemeralDefer: true,

  run: (client, interaction) => {
    const queue = client.musicPlayer.getQueue(interaction.guild.id);
    const song = queue.songs[0];

    const embed = new MessageEmbed()
      .setTitle('Now playing')
      .setDescription(
        `I am currently playing\n` +
        `[${song.name}](${song.url}) \`${song.formattedDuration - queue.formattedCurrentTime}:${queue.formattedCurrentTime}\``
      )
      .setColor(colors.discord.BURPLE);

    interaction.editReply({ embeds: [embed] });
  }
})