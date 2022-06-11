const { MessageEmbed } = require('discord.js');

module.exports = async (client) => {
  client.musicPlayer = require('./music_player')(client);

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