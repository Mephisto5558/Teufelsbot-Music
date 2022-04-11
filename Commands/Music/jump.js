const { Command } = require("reconlx");
const player = require('../../Handlers/music_player')

module.exports = new Command({
  name: 'jump',
  description: `Jump to a song`,
  userPermissions: [],
  category: "Music",
  options: [{
    name: "position",
    description: `Jump to a Song Number in the queue`,
    type: "NUMBER",
    required: true
  }],

  run: async (client, interaction) => {
    let queue = player.getQueue(interaction.guild.id);
    if (!queue.songs) return interaction.followUp(`There are no songs in the queue!`);
    console.log(queue.songs.count)
    let postion = interaction.options.getNumber('position');
    await queue.jump(postion)
    interaction.followUp(`Jumped to ${queue.songs[postion].name}`)
  }
})