const
  { EmbedBuilder } = require('discord.js'),
  getLyrics = require('songlyrics').default,
  { search } = require('yt-search');

module.exports = {
  name: 'lyrics',
  description: 'search for song lyrics',
  cooldowns: { user: 5000 },
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

  run: async function () {
    const
      song = this.options.getString('song'),
      embed = new EmbedBuilder({
        title: song,
        footer: {
          text: this.user.tag,
          iconURL: this.user.displayAvatarURL()
        }
      }).setColor('Random');

    let { lyrics, title, source } = await getLyrics(`${song} ${this.options.getString('artist')}`) || {};

    if (!lyrics) {
      embed.data.description =
        `No Lyrics found for \`${song}\` with matching title.\n` +
        'Maybe try another title or the `author` option, if not used.'

      return this.editReply({ embeds: [embed] });
    }

    if (lyrics.length > 4092) lyrics = lyrics.substring(0, lyrics.substring(0, 4081).lastIndexOf('/n')) + '...';

    embed.data.description = lyrics;
    embed.addFields([{ name: 'Source', value: `[${source.url}](${source.link})`, inline: true }]);

    const video = (await search(title)).videos
      .slice(0, 5)
      .sort((a, b) => b.views - a.views)[0];

    if (video) {
      embed.data.title = `${video.title} by ${video.author.name}`;
      embed.data.url = video.url;
      embed.setThumbnail(video.image);
    }

    this.editReply({ embeds: [embed] });
  }
};