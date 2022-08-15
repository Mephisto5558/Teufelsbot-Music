const
  { Collection } = require('discord.js'),
  { DisTube } = require('distube'),
  { YtDlpPlugin } = require('@distube/yt-dlp'),
  { SpotifyPlugin } = require('@distube/spotify'),
  { SoundCloudPlugin } = require('@distube/soundcloud');

const reply = ({ musicPlayer, functions }, content, channel) => {
  const player = musicPlayer.interaction?.get(channel.guild.id);
  if (!player) return channel.send(content);

  functions.editPlayer(player, content, { asEmbed: true });
};

module.exports = async client => {
  client.musicPlayer = new DisTube(client, {
    leaveOnEmpty: true,
    emptyCooldown: 1 * 60 * 60, //1h
    leaveOnStop: false,
    youtubeCookie: process.env.ytCookie,
    plugins: [
      new YtDlpPlugin(),
      new SpotifyPlugin(),
      new SoundCloudPlugin()
    ]
  });

  client.musicPlayer.interaction = new Collection();

  client.musicPlayer
    .on('addSong', ({ duration, textChannel }, song) => {
      reply(client,
        `Added [${song.name}](${song.url}) - \`${song.formattedDuration}\`.\n` +
        `Requested by: <@${song.user.id}>\n` +
        `It will play in about \`${(duration - song.duration).toFormattedTime()}\`.`,
        textChannel
      );
    })

    .on('addList', ({ textChannel, duration }, playlist) => {
      reply(client,
        `Added [${playlist.name}](${playlist.url}) playlist (\`${playlist.songs.length}\` songs).\n` +
        `Requested by: <@${playlist.user.id}>\n` +
        `They will play in about \`${(duration - playlist.duration).toFormattedTime()}\`.`,
        textChannel
      );
    })

    .on('playSong', ({ textChannel }, { name, url, formattedDuration, user }) => {
      reply(client,
        '**Now playing**:\n' +
        `[${name}](${url}) - \`${formattedDuration}\`\n` +
        `Requested by: <@${user.id}>`,
        textChannel
      );
    })

    .on('disconnect', ({ textChannel }) => reply(client, `Leaving Channel`, textChannel))

    .on('initQueue', queue => {
      queue.autoplay = false;
      queue.volume = 100;
    })
    .on('error', (_, err) => { throw err });
}