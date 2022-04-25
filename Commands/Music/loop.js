const { Command } = require("reconlx");
const player = require('../../Handlers/music_player')

module.exports = new Command({
  name: 'loop',
  aliases: 'repeat',
  description: `Loop a song`,
  userPermissions: [],
  cooldown: {global: 0, user: 2000},
  category: "Music",

  run: async (client, interaction) => {
    let queue = player.getQueue(interaction.guild.id);
    if(!queue) return interaction.followUp("You need to play music first!");
    if (queue.repeatMode === 1) {
      queue.setRepeatMode(0)
      return interaction.followUp(`Song loop disabled`)
    }
    else {
      await queue.setRepeatMode(1)
      interaction.followUp(`Song loop enabled`)
    }
  }
})