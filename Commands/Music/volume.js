const { Command } = require("reconlx");
const player = require('../../Handlers/music_player')

module.exports = new Command({
  name: 'volume',
  description: `Set the player volume`,
  userPermissions: [],
  cooldown: {global: 0, user: 500},
  category: "Music",
  options : [{
    name : "vol",
    description : `Give me Number between 0 and 200`,
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