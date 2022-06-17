const
  { Collection } = require('discord.js'),
  { DisTube } = require('distube'),
  { YtDlpPlugin } = require('@distube/yt-dlp'),
  { SpotifyPlugin } = require('@distube/spotify'),
  { SoundCloudPlugin } = require('@distube/soundcloud');

function reply(client, data, channel, asError) {
  const player = client.musicPlayer.interaction?.get(channel?.guild.id) || client.musicPlayer.interaction?.get(client.interaction?.guild.id);

  if (!data) throw new SyntaxError('Missing data to send');
  if (!player) return client.interaction?.followUp(data);

  if (player.replied) return editReply(player, data, true, asError);
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
    youtubeCookie: 'YSC=XeCRLH7EVI4; VISITOR_INFO1_LIVE=RVa2sp1L_kk; wide=1; CONSENT=YES+shp.gws-20211208-0-RC2.de+FX+582; PREF=tz=Europe.Berlin&f6=40000000&library_tab_browse_id=FEmusic_library_privately_owned_tracks&f3=8; CONSISTENCY=AGDxDeNeWzixL65mGXqXuvNb_Gh3HMwBJcQJ1rKo7ftfhgjPhpJPofZ8cKc7sJIXohg6IsvroTphBxo2RcOVF2COrYD0KLJqazHUDr_PIDduYHr7ABGO4eCIe2U2tvdATgxlcZoXV2G8_v1UOiK2_lO7; HSID=AoA4AxVhD5uuy5YYG; SSID=AksXxAeLaxWF3Yis4; APISID=Ep0OOH0C3BUxy9Yg/AaA5_sP27nVltiZ6b; SAPISID=6OgNw7Le5FR5bqNN/AN7e7VF4tLK1srToS; __Secure-1PAPISID=6OgNw7Le5FR5bqNN/AN7e7VF4tLK1srToS; __Secure-3PAPISID=6OgNw7Le5FR5bqNN/AN7e7VF4tLK1srToS; GPS=1; SID=JQjnSTmOFApKbEZUE0VnZmwpH4UdvsPVs6oqZKR8lFSUyFSAm7MLGbNmTq2SvxnqlJT_WA.; __Secure-1PSID=JQjnSTmOFApKbEZUE0VnZmwpH4UdvsPVs6oqZKR8lFSUyFSA6y7fsDRW7gpe5Y1J410CHg.; __Secure-3PSID=JQjnSTmOFApKbEZUE0VnZmwpH4UdvsPVs6oqZKR8lFSUyFSA1CjgFY4dGFBk_dMIjPeXKw.; LOGIN_INFO=AFmmF2swRQIgf-r8gS67m5yTcXZTfLeQZylQArBKdFf6tsxTb4lEJqkCIQCE7rhI9UvNpNIbJJhk_tg0ig-iKcpUucxAj7kttmPn9w:QUQ3MjNmenlQcEhoeXFuZy1BeHNfQnNKYXYyMUFnUno5dWg0UThOUTM1bEkxQU4xRzg0Z0lpU09MTTAxRXVKZzdiT2dLeXF5b0VFTkYyOTQ1ajZabDNOUDk2ajBwdjBFeTlyYXNmX3ozQnlTMEV4NVEtVWRpb194d1FXaHR5YkUtbDAtY2lWbThobm53NWNlT29FcXBsUU52c0xEZGkyblJn; SIDCC=AJi4QfGkDnPyHpOsYKkTPngZV-mdHasDYVly9TG0Z6BdYW2Sl8GT-IgVDd44lEJnWhiXoANK1g8; __Secure-3PSIDCC=AJi4QfFD4rH41lyT2pm1ApIEhq_7Dn5b3pyRn5A2FlRDjRdQnbteT9TqxPRabc7e1NmG6kcP81Q'
  });

  client.musicPlayer.interaction = new Collection();

  client.musicPlayer
    .on('addSong', (queue, song) => {
      reply(
        client,
        `Added [${song.name}](${song.url}) - \`${song.formattedDuration}\`\nRequested by: ${song.user}\n` +
        `It will play in about \`${Number.prototype.toFormattedTime(queue.duration - queue.currentTime)}\``,
        queue.textChannel
      )
    })

    .on('addList', (queue, playlist) => {
      reply(
        client, 
        `Added \`${playlist.name}\` playlist (${playlist.songs.length} songs) to the queue by ${playlist.user}\n` +
        `They will play in about \`${Number.prototype.toFormattedTime(queue.duration - queue.currentTime)}\``,
        queue.textChannel
      )
    })

    .on('playSong', (queue, song) => {
      reply(
        client, `**Now playing**:\n [${song.name}](${song.url}) - \`${song.formattedDuration}\`\nRequested by: ${song.user}`,
        queue.textChannel
      )
    })

    .on('disconnect', queue => {
      reply(client, `Nothing left to play, leaving channel`, queue.textChannel)
    })

    .on('initQueue', queue => {
      queue.autoplay = false;
      queue.volume = 100;
    })

    .on('searchNoResult', queue => {
      reply(client, 'No result found!', queue.textChannel, true);
    })

    .on('searchResult', _ => { })

    .on('searchCancel', _ => { })

    .on('searchInvalidAnswer', _ => { })

    .on('searchDone', _ => { })

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
      console.log(`\n`)
    })
}