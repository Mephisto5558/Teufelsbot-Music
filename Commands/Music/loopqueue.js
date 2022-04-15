const { Command } = require("reconlx");
const player = require('../../Handlers/music_player')

module.exports = new Command({
  name: 'loopqueue',
  description: `Loop a queue`,
  userPermissions: [],
  category: "Music",

  run: async (client, interaction) => {
    let queue = player.getQueue(interaction.guild.id);
    if(!queue) return interaction.followUp("You need to play music first!");
    if (queue.repeatMode === 2) {
      queue.setRepeatMode(0)
      return interaction.followUp(`Queue loop disabled`)
    }
    else {
      await queue.setRepeatMode(2)
      interaction.followUp(`Queue loop enabled`)
    }
  }
})