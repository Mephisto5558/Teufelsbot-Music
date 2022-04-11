const { Command } = require("reconlx");
const player = require('../../Handlers/music_player')

module.exports = new Command({
  name: 'clearqueue',
  description: `Clear all songs from a queue`,
  userPermissions: [],
  category: "Music",
  
  run: async (client, interaction) => {
    let queue = player.getQueue(interaction.guild.id)
    if (!queue.songs) return interaction.followUp(`There are no songs in the queue!`)
    await queue.delete()
    interaction.followUp(`Queue cleared`)
  }
})