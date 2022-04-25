const { Command } = require("reconlx");
const player = require('../../Handlers/music_player')

module.exports = new Command({
  name: 'resume',
  description: `Resume a Song`,
  userPermissions: [],
  cooldown: {global: 0, user: 2000},
  category: "Music",

  run: async (client, interaction) => {
    let queue = player.getQueue(interaction.guild.id)
    if (!queue?.songs) return interaction.followUp(`There are no Songs in the queue`)
    if (!queue.paused) return interaction.followUp(`The Player is not paused!`)
    await queue.resume()
    interaction.followUp(`Player resumed`)
  }
})