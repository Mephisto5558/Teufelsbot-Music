const
  { Command } = require('reconlx'),
  { MessageEmbed } = require('discord.js'),
  lyricFinder = require('lyrics-finder'),
  { search } = require('yt-search');

module.exports = new Command({
  name: 'lyrics',
  description: 'searches song lyrics on google',
  permissions: { client: [], user: [] },
  cooldown: { global: 0, user: 0 },
  category: 'Information',
  options: [{
    name: 'song',
    description: 'The title of the song',
    type: 'STRING',
    required: true
  }],

  run: async (_, interaction) => {
    const
      query = interaction.options.getString('song'),
      lyrics = await lyricFinder(query),
      embed = new MessageEmbed()
        .setColor('RANDOM')
        .setFooter({
          text: interaction.user.tag,
          iconURL: interaction.user.displayAvatarURL()
        });

    if (!lyrics) {
      embed
        .setTitle('Lyric Search')
        .setDescription(`No Lyrics found for \`${query}\``);

      return interaction.editReply({ embeds: [embed] });
    }

    if (lyrics.length > 4092) lyrics = lyrics.substring(0, 4087) + '\n...';

    embed.setDescription(lyrics);

    const res = await search(query);
    const song = res.videos[0];

    if (song) {
      embed
        .setTitle(song.title)
        .setURL(song.url)
        .setThumbnail(song.image)
    }

    interaction.editReply({ embeds: [embed] })
  }
})