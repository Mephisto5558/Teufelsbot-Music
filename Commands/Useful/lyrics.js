const
  { Command } = require('reconlx'),
  { MessageEmbed } = require('discord.js'),
  getLyrics = require('songlyrics').default,
  { search } = require('yt-search');

module.exports = new Command({
  name: 'lyrics',
  description: 'search for song lyrics',
  permissions: { client: [], user: [] },
  cooldowns: { global: 0, user: 5000 },
  category: 'Useful',
  options: [
    {
      name: 'song',
      description: 'The title of the song',
      type: 'STRING',
      required: true
    },
    {
      name: 'artist',
      description: 'who made the song',
      type: 'STRING',
      required: true
    }
  ],

  run: async (_, interaction) => {
    const
      song = interaction.options.getString('song'),
      embed = new MessageEmbed()
        .setTitle(song)
        .setColor('RANDOM')
        .setFooter({
          text: interaction.user.tag,
          iconURL: interaction.user.displayAvatarURL()
        });

    let { lyrics, title, source } = await getLyrics(`${song} ${interaction.options.getString('artist')}`) || { lyrics: null, title: null, source: null }

    if (!lyrics || !song.split(' ').filter(a => a.length > 3 && title.includes(a)).length) {
      embed.setDescription(
        `No Lyrics found for \`${song}\` with matching title.\n` +
        'Maybe try another title or the `author` option, if not used.'
      );

      return interaction.editReply({ embeds: [embed] });
    }

    if (lyrics.length > 4092) lyrics = lyrics.substring(0, lyrics.substring(0, 4081).lastIndexOf('/n')) + '...';

    embed
      .setDescription(lyrics)
      .addField('Source', `[${source.url}](${source.link})`, true)
      .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

    const video = (await search(title)).videos
      .slice(0, 5)
      .sort((a, b) => b.views - a.views)[0];

    if (video) {
      embed
        .setTitle(`${video.title} by ${video.author.name}`)
        .setURL(video.url)
        .setThumbnail(video.image)
    }

    interaction.editReply({ embeds: [embed] })
  }
})