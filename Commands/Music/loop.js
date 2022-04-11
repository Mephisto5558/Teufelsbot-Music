const { Command } = require("reconlx");
const player = require('../../Handlers/music_player')

module.exports = new Command({
  name: 'loop',
  aliases: 'repeat',
  description: `Loop a song`,
  userPermissions: [],
  category: "Music",

  run: async (client, interaction) => {
    let queue = player.getQueue(interaction.guild.id);
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