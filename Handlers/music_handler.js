const
  { Collection } = require('discord.js'),
  { DisTube } = require('distube'),
  { YtDlpPlugin } = require('@distube/yt-dlp'),
  { SpotifyPlugin } = require('@distube/spotify'),
  { SoundCloudPlugin } = require('@distube/soundcloud');

function reply(content, channel) {
  const player = this.musicPlayer.interaction?.get(channel.guild.id);
  if (!player) return channel.send(content);

  player.editPlayer(content, { asEmbed: true });
}

module.exports = async function musicHandler() {
  this.musicPlayer = new DisTube(this, {
    leaveOnEmpty: true,
    emptyCooldown: 1 * 60 * 60,
    leaveOnStop: false,
    youtubeCookie: process.env.ytCookie,
    plugins: [
      new YtDlpPlugin(),
      new SpotifyPlugin(),
      new SoundCloudPlugin()
    ]
  });

  this.musicPlayer.interaction = new Collection();

  this.musicPlayer
    .on('addSong', ({ duration, textChannel }, song) => {
      reply.call(this,
        `Added [${song.name}](${song.url}) - \`${song.formattedDuration}\`.\n` +
        `Requested by: <@${song.user.id}>\n` +
        `It will play in about \`${(duration - song.duration).toFormattedTime()}\`.`,
        textChannel
      );
    })

    .on('addList', ({ textChannel, duration }, playlist) => {
      reply.call(this,
        `Added [${playlist.name}](${playlist.url}) playlist (\`${playlist.songs.length}\` songs).\n` +
        `Requested by: <@${playlist.user.id}>\n` +
        `They will play in about \`${(duration - playlist.duration).toFormattedTime()}\`.`,
        textChannel
      );
    })

    .on('playSong', ({ textChannel }, { name, url, formattedDuration, user }) => {
      reply.call(this,
        '**Now playing**:\n' +
        `[${name}](${url}) - \`${formattedDuration}\`\n` +
        `Requested by: <@${user.id}>`,
        textChannel
      );
    })

    .on('disconnect', ({ textChannel }) => reply.call(this, `Leaving Channel`, textChannel))

    .on('initQueue', queue => {
      queue.autoplay = false;
      queue.volume = 100;
    })
    .on('error', (_, err) => { throw err; });
}