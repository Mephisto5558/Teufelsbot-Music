const distube = require('./music_player')
const { MessageEmbed } = require("discord.js");

module.exports = async (client) => {
  
  distube
    .on("playSong", (queue, song) => {
      queue.textChannel.send({
        embeds: [ new MessageEmbed()
          .setDescription(`Now playing:\n [${song.name}](${song.url}) - \`${song.formattedDuration}\`\nRequested by: ${song.user}`)
        ]
      })
    })

    .on("addSong", (queue, song) => {
      queue.textChannel.send({
        embeds: [ new MessageEmbed()
          .setDescription(`Added [${song.name}](${song.url}) - \`${song.formattedDuration}\`\nRequested by: ${song.user}`)
        ]
      })
    })

    .on("addList", (queue, playlist) => {
       queue.textChannel.send({
        embeds: [ new MessageEmbed()
          .setDescription(`Added \`${playlist.name}\` playlist (${playlist.songs.length} songs) to the queue by ${playlist.user}`)
        ]
      })
    })
  
    .on("disconnect", (queue) => {
      queue.textChannel.send({
        embeds: [ new MessageEmbed()
          .setDescription(`Nothing left to play, leaving channel`)
        ]
      })
    })

    .on("initQueue", queue => {
      queue.autoplay = false;
      queue.volume = 100;
    })

    .on('searchNoResult', () => {
      client.interaction.followUp('No result found!');
    })
    
    .on('searchResult', (_, result) => {
      let i = 0
      client.interaction.followUp(
        `**Choose an option from below**\n${result
          .map(song =>`**${++i}**. ${song.name} - \`${song.formattedDuration}\``)
          .join('\n')
        }`
      )
    })
    
    .on('searchCancel', () =>
        client.interaction.followUp('Searching canceled')
    )
    
    .on('searchInvalidAnswer', () =>
        client.interaction.followUp('Invalid number of result.'),
    )
    
    .on('searchDone', () => {})

    .on("error", (channel, err) => {
      if (err.errorCode == 'VOICE_FULL') return client.interaction.followUp("This voice channel is full.");
      if (err.errorCode == 'VOICE_MISSING_PERMS') return client.interaction.followUp("I don't have permission to join this voice channel");

      client.interaction.followUp(`A unknown error occurred, please ping the dev.\nError Code: \`${err.errorCode || 'unknown'}\``);
      console.log(' [Error Handling] :: DisTubeError');
      console.log(err, channel);
      console.log(`\n`)
    })
}