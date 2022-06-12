const
  { MessageEmbed } = require('discord.js'),
  { DisTube } = require('distube'),
  { YtDlpPlugin } = require('@distube/yt-dlp'),
  { SpotifyPlugin } = require('@distube/spotify'),
  { SoundCloudPlugin } = require('@distube/soundcloud');

module.exports = async (client) => {
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
  })

  client.musicPlayer
    .on('addSong', (_, song) => {
     client.interaction.editReply({
        embeds: [ new MessageEmbed()
          .setDescription(`Added [${song.name}](${song.url}) - \`${song.formattedDuration}\`\nRequested by: ${song.user}`)
        ]
      })
    })

    .on('addList', (_, playlist) => {
      client.interaction.editReply({
        embeds: [ new MessageEmbed()
          .setDescription(`Added \`${playlist.name}\` playlist (${playlist.songs.length} songs) to the queue by ${playlist.user}`)
        ]
      })
    })

    .on('playSong', (_, song) => {
      client.interaction.editReply({
        embeds: [ new MessageEmbed()
          .setDescription(`Now playing:\n [${song.name}](${song.url}) - \`${song.formattedDuration}\`\nRequested by: ${song.user}`)
        ]
      })
    })

    .on('disconnect', _ => {
      client.interaction.editReply({
        embeds: [ new MessageEmbed()
          .setDescription(`Nothing left to play, leaving channel`)
        ]
      })
    })

    .on('initQueue', queue => {
      queue.autoplay = false;
      queue.volume = 100;
    })

    .on('searchNoResult', _ => {
      client.interaction.editReply('No result found!');
    })

    .on('searchResult', (_, result) => {
      let i = 0
      client.interaction.editReply(
        `**Choose an option from below**\n${result
          .map(song => `**${i++}**. ${song.name} - \`${song.formattedDuration}\``)
          .join('\n')
        }`
      )
    })

    .on('searchCancel', message =>
      message.channel.send('Searching canceled')
    )

    .on('searchInvalidAnswer', () =>
      message.channel.send('Invalid number of result.'),
    )

    .on('searchDone', _ => { })

    .on('error', (channel, err) => {
      if (err.errorCode == 'VOICE_FULL') return client.interaction.followUp('This voice channel is full.');
      if (err.errorCode == 'VOICE_MISSING_PERMS') return client.interaction.followUp("I don't have permission to join this voice channel");

      client.interaction.followUp(
        'A unknown error occurred, please ping the dev.\n' +
        `Error Code: \`${err.errorCode || 'unknown'}\``
      );
      console.log(' [Error Handling] :: DisTubeError');
      console.log(err, channel);
      console.log(`\n`)
    })
}