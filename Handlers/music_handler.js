const
  { Collection } = require('discord.js'),
  { DisTube } = require('distube'),
  { YtDlpPlugin } = require('@distube/yt-dlp'),
  { SpotifyPlugin } = require('@distube/spotify'),
  { SoundCloudPlugin } = require('@distube/soundcloud');

const reply = ({ musicPlayer, interaction, functions }, data, channel, asError) => {
  const player = musicPlayer.interaction?.get(channel?.guild.id) || musicPlayer.interaction?.get(interaction?.guild.id);

  if (!data) throw new SyntaxError('Missing data to send');
  if (!player) return interaction?.editReply(data);
  
  try { functions.editPlayer(player, data, true, asError) }
  catch { player.reply(data) }
};

module.exports = async client => {
  client.musicPlayer = new DisTube(client, {
    leaveOnEmpty: true,
    emptyCooldown: 1*60*60, //1h
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
    .on('addSong', (queue, song) => {
      reply(
        client,
        `Added [${song.name}](${song.url}) - \`${song.formattedDuration}\`\nRequested by: <@${song.user.id}>\n` +
        `It will play in about \`${(queue.duration - song.duration).toFormattedTime()}\``,
        queue.textChannel
      );
    })

    .on('addList', ({ textChannel, duration }, playlist) => {
      const player = client.musicPlayer.interaction?.get(textChannel.guild.id);
      player.playlist = { name: playlist.name, url: playlist.url };

      client.musicPlayer.interaction.set(textChannel.guild.id);

      reply(
        client,
        `Added \`[${playlist.name}](${playlist.url})\` playlist (\`${playlist.songs.length}\` songs)\nRequested by: <@${playlist.user.id}>\n` +
        `They will play in about \`${(duration - playlist.duration).toFormattedTime()}\``,
        textChannel
      );
    })

    .on('playSong', ({ textChannel }, { name, url, formattedDuration, user }) => {
      reply(
        client, `**Now playing**:\n [${name}](${url}) - \`${formattedDuration}\`\nRequested by: <@${user.id}>`,
        textChannel
      );
    })

    .on('disconnect', ({ textChannel }) => reply(client, `Leaving Channel`, textChannel))

    .on('initQueue', queue => {
      queue.autoplay = false;
      queue.volume = 100;
    });
}