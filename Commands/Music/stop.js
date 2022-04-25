const { Command } = require("reconlx");
const player = require('../../Handlers/music_player')

module.exports = new Command({
  name: 'stop',
  description: `Stop a Song`,
  userPermissions: [],
  cooldown: {global: 0, user: 2000},
  category: "Music",

  run: async (client, interaction) => {
    let queue = player.getQueue(interaction.guild.id)
    if (!queue.songs) return interaction.followUp(`No Songs in Queue`)
    await queue.stop()
    interaction.followUp(`Player stoped`)
  }
})