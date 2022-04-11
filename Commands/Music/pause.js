const { Command } = require("reconlx");
const player = require('../../Handlers/music_player')

module.exports = new Command({
  name: 'pause',
  description: `Pause the player`,
  userPermissions: [],
  category: "Music",

  run: async (client, interaction) => {
    let queue = player.getQueue(interaction.guild.id)
    if (!queue?.songs) return interaction.followUp(`There are no songs in the queue`);
    if (queue.paused) return interaction.followUp(`The player is aready paused`);
    await queue.pause()
    interaction.followUp(`Player paused`)
  }
})