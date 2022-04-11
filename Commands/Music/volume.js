const { Command } = require("reconlx");
const player = require('../../Handlers/music_player')

module.exports = new Command({
  name: 'volume',
  description: `Set the volume of a song`,
  userPermissions: [],
  category: "Music",
  options : [{
    name : "vol",
    description : `Give me Number between 1 - 200`,
    required : true,
    type : "NUMBER"
  }],
  
  run: async (client, interaction) => {
    let queue = player.getQueue(interaction.guild.id);
    let volume = interaction.options.getNumber('vol')
    if (!queue?.songs) return interaction.followUp(`You need to play music first!`)
    if (volume > 200) volume = 200
    await queue.setVolume(Number(volume))
    interaction.followUp(`The volume has been set to ${volume}%`)
  }
})