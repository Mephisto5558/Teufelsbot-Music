const
  { EmbedBuilder, Colors } = require('discord.js'),
  { DisTube } = require('distube'),
  { YtDlpPlugin } = require('@distube/yt-dlp'),
  embed = new EmbedBuilder({ title: 'Music Player', color: Colors.Blurple });

module.exports = function musicPlayer() {
  return new DisTube(this, {
    leaveOnEmpty: true,
    emptyCooldown: 60 * 60,
    leaveOnStop: false,
    youtubeCookie: this.keys.ytCookie,
    plugins: [new YtDlpPlugin()]
  })
    .on('addSong', ({ duration, textChannel, metadata }, song) => {
      embed.data.description =
        `Added [${song.name}](${song.url}) - \`${song.formattedDuration}\`.\n` +
        `Requested by: <@${song.user.id}>\n` +
        `It will play in about \`${(duration - song.duration).toFormattedTime()}\`.`;

      if (metadata?.msg) return metadata.msg.edit({ embeds: [embed] });
      textChannel.send({ embeds: [embed] });
    })
    .on('addList', ({ textChannel, duration, metadata }, playlist) => {
      embed.data.description =
        `Added [${playlist.name}](${playlist.url}) playlist (\`${playlist.songs.length}\` songs).\n` +
        `Requested by: <@${playlist.user.id}>\n` +
        `They will play in about \`${(duration - playlist.duration).toFormattedTime()}\`.`;

      if (metadata?.msg) return metadata.msg.edit({ embeds: [embed] });
      textChannel.send({ embeds: [embed] });
    })
    .on('playSong', ({ textChannel }, { name, url, formattedDuration, user }) => {
      embed.data.description =
        '**Now playing**:\n' +
        `[${name}](${url}) - \`${formattedDuration}\`\n` +
        `Requested by: <@${user.id}>`;

      textChannel.send({ embeds: [embed] });
    })
    .on('initQueue', queue => {
      queue.autoplay = false;
      queue.volume = 100;
    })
    .on('disconnect', ({ textChannel }) => {
      embed.data.description = 'Leaving Channel';
      textChannel.send({ embeds: [embed] });
    })
    .on('error', (_, err) => { throw err; });
};