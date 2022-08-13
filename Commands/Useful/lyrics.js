const
  { Command } = require('reconlx'),
  { EmbedBuilder } = require('discord.js'),
  getLyrics = require('songlyrics').default,
  { search } = require('yt-search');

module.exports = new Command({
  name: 'lyrics',
  aliases: [],
  description: 'search for song lyrics',
  permissions: { client: [], user: [] },
  cooldowns: { global: 0, user: 5000 },
  category: 'Useful',
  options: [
    {
      name: 'song',
      description: 'The title of the song',
      type: 'String',
      required: true
    },
    {
      name: 'artist',
      description: 'who made the song',
      type: 'String',
      required: true
    }
  ],

  run: async (_, interaction) => {
    const
      song = interaction.options.getString('song'),
      embed = new EmbedBuilder({
        title: song,
        footer: {
          text: interaction.user.tag,
          iconURL: interaction.user.displayAvatarURL({ dynamic: true })
        }
      }).setColor('Random');

    let { lyrics, title, source } = await getLyrics(`${song} ${interaction.options.getString('artist')}`) || { lyrics: null, title: null, source: null }

    if (!lyrics || !song.split(' ').filter(a => a.length > 3 && title.includes(a)).length) {
      embed.description =
        `No Lyrics found for \`${song}\` with matching title.\n` +
        'Maybe try another title or the `author` option, if not used.\n' +
        'If you know any lyric api, please message the dev.';

      return interaction.editReply({ embeds: [embed] });
    }

    if (lyrics.length > 4092) lyrics = lyrics.substring(0, lyrics.substring(0, 4081).lastIndexOf('/n')) + '...';

    embed.description = lyrics;
    embed.footer = { text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) };
    embed.addField('Source', `[${source.url}](${source.link})`, true);

    const video = (await search(title)).videos
      .slice(0, 5)
      .sort((a, b) => b.views - a.views)[0];

    if (video) {
      embed.title = `${video.title} by ${video.author.name}`;
      embed.url = video.url;
      embed.setThumbnail(video.image);
    }

    interaction.editReply({ embeds: [embed] })
  }
})