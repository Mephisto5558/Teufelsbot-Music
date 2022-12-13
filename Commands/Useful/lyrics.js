const
  { EmbedBuilder } = require('discord.js'),
  getLyrics = require('songlyrics').default,
  { search } = require('yt-search');

module.exports = {
  name: 'lyrics',
  cooldowns: { user: 5000 },
  options: [
    {
      name: 'title',
      type: 'String',
      maxLength: 300,
      required: true
    },
    {
      name: 'artist',
      type: 'String',
      required: true
    }
  ],

  run: async function (lang) {
    const
      embed = new EmbedBuilder({
        title: this.options.getString('title'),
        footer: {
          text: this.user.tag,
          iconURL: this.user.displayAvatarURL()
        }
      }).setColor('Random');

    let { lyrics, title, source } = await getLyrics(`${song} ${this.options.getString('artist')}`) || {};

    if (!lyrics) return this.editReply({ embeds: [embed.setDescription(lang('notFound'))] });
    if (lyrics.length > 4092) lyrics = lyrics.substring(0, lyrics.substring(0, 4081).lastIndexOf('/n')) + '...';

    embed.data.description = lyrics;
    embed.addFields([{ name: lang('embedFieldName'), value: `[${source.url}](${source.link})`, inline: true }]);

    const video = (await search(title)).videos
      .slice(0, 5)
      .sort((a, b) => b.views - a.views)[0];

    if (video) {
      embed.data.title = lang('embedTitle', { title: video, author: video.author.name });
      embed.data.url = video.url;
      embed.setThumbnail(video.image);
    }

    this.editReply({ embeds: [embed] });
  }
};