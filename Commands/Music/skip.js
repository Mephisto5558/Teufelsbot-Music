const { Command } = require("reconlx");
const player = require('../../Handlers/music_player')

module.exports = new Command({
  name: 'skip',
  description: `Skip a song`,
  userPermissions: [],
  cooldown: {global: 0, user: 500},
  category: "Music",

  run: async (client, interaction) => {
    let queue = player.getQueue(interaction.guild.id)
    if (!queue?.songs) return interaction.followUp(`There are no Songs in the queue!`)
    if(queue.songs.length === 1){
      queue.stop()
      interaction.followUp(`Song skiped, queue is now empty.`)
    }
    else {
      await queue.skip();
      interaction.followUp(`Song skiped`)
    }
  }
})