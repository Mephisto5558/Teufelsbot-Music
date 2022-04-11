const { Command } = require("reconlx");
const player = require('../../Handlers/music_player')

module.exports = new Command({
  name: 'playskip',
  description: `Play a song by skipping the current one`,
  userPermissions: [],
  category: "Music",
  options: [{
    name: "song",
    description: "Type a song name or link",
    type: "STRING",
    required: true,
  }],

  run: async (client, interaction) => {
    let member = interaction.guild.members.cache.get(interaction.member.id)
    let song = interaction.options.getString('song');
    
    player.play(member.voice.channel, song, {
      member: member,
      textChannel: interaction.channel,
      skip: true
    })
  }
})