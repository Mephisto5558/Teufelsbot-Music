const
  { Collection } = require('discord.js'),
  { DisTube } = require('distube'),
  { YtDlpPlugin } = require('@distube/yt-dlp'),
  { SpotifyPlugin } = require('@distube/spotify'),
  { SoundCloudPlugin } = require('@distube/soundcloud');

function reply({ musicPlayer, interaction, functions }, data, channel, asError) {
  const player = musicPlayer.interaction?.get(channel?.guild.id) || musicPlayer.interaction?.get(interaction?.guild.id);

  if (!data) throw new SyntaxError('Missing data to send');
  if (!player) return interaction?.editReply(data);

  if (player.replied) return functions.editPlayer(player, data, true, asError);
  else return player.reply(data);
}

module.exports = async client => {
  client.musicPlayer = new DisTube(client, {
    emitNewSongOnly: false,
    leaveOnEmpty: false,
    leaveOnFinish: false,
    leaveOnStop: false,
    youtubeDL: false,
    savePreviousSongs: true,
    plugins: [
      new YtDlpPlugin(),
      new SpotifyPlugin(),
      new SoundCloudPlugin()
    ],
    youtubeCookie: process.env.ytCookie
  });

  client.musicPlayer.interaction = new Collection();

  client.musicPlayer
    .on('addSong', (queue, song) => {
      reply(
        client,
        `Added [${song.name}](${song.url}) - \`${song.formattedDuration}\`\nRequested by: ${song.user}\n` +
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
        `Added \`${playlist.name}\` playlist (${playlist.songs.length} songs) to the queue by ${playlist.user}\n` +
        `They will play in about \`${Number.prototype.toFormattedTime(duration - playlist.duration)}\``,
        textChannel
      );
    })

    .on('playSong', ({ textChannel }, { name, url, formattedDuration, user }) => {
      reply(
        client, `**Now playing**:\n [${name}](${url}) - \`${formattedDuration}\`\nRequested by: ${user.id != client.user.id ? user : 'Autoplay'}`,
        textChannel
      );
    })

    .on('disconnect', ({ textChannel }) => reply(client, `Leaving Channel`, textChannel))

    .on('initQueue', ({ autoplay, volume }) => {
      autoplay = false;
      volume = 100;
    })

    .on('error', (channel, err) => {
      if (err.errorCode == 'VOICE_FULL') return reply(client, 'This voice channel is full.', channel, true);
      if (err.errorCode == 'VOICE_MISSING_PERMS') reply(client, "I don't have permission to join this voice channel", channel, true);

      reply(
        client,
        'A unexpected error occurred, please message the dev.\n' +
        `Error Type: \`${err.type || 'unknown'}\``,
        channel, true
      );

      console.log(' [Error Handling] :: DisTubeError');
      console.log(err, channel);
      console.log(`\n`);
    });
}