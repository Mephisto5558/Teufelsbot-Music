const { Command } = require("reconlx");
const player = require('../../Handlers/music_player');

module.exports = new Command({
  name: 'shuffle',
  description: `Shuffles the queue`,
  userPermissions: [],
  cooldown: {global:0, user: 'default'},
  category: "Music",

  run: async (_, interaction) => {
    let queue = player.getQueue(interaction.guild.id)
    queue.shuffle
    interaction.followUp('Shuffled the queue!')
  }
})