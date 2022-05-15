const
  { Command } = require("reconlx"),
  { MessageEmbed } = require('discord.js'),
  lyricFinder = require('lyrics-finder'),
  { search } = require('yt-search');

module.exports = new Command({
  name: 'lyrics',
  description: `searches song lyrics on google`,
  userPermissions: [],
  cooldown: { global: 0, user: 0 },
  category: "Other",
  options: [{
    name: 'song',
    description: 'The title of the song',
    type: 'STRING',
    required: true
  }],

  run: async (_, interaction) => {

    let embed = new MessageEmbed()
      .setColor('RANDOM')
      .setFooter({
        text: `Requested by ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL()
      });

    let query = interaction.options.getString('SONG');
    let lyrics = lyricFinder(lyrics);

    if (!lyrics) {
      embed.setTitle('Lyric Search')
      embed.setDescription(`No Lyrics found for ${query}`);
      return interaction.editReply({ embeds: [embed] });
    }
    
    if(lyrics.length > 4092)
      lyrics = lyrics.substring(0, 4087) + '\n...';

    embed.setDescription(lyrics);

    let res = await search(query); 
    let song = res.videos[0];

    if(song) {
      embed
        .setTitle(song.title)
        .setURL(song.url)
        .setThumbnail(song.image)
    }

    interaction.editReply({ embeds: [embed] })
  }
})