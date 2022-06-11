const { Command } = require('reconlx');

module.exports = new Command({
  name: 'jump',
  description: 'Jump to a song',
  permissions: { client: [], user: [] },
  cooldown: { client: 1000, user: 2000 },
  category: 'Music',
  options: [{
    name: 'position',
    description: 'Jump to a Song Number in the queue',
    type: 'NUMBER',
    required: true
  }],

  run: async (client, interaction) => {
    const queue = client.musicPlayer.getQueue(interaction.guild.id);
    const postion = interaction.options.getNumber('position');

    if (!queue.songs) return interaction.editReply('There are no songs in the queue!');

    await queue.jump(postion);

    interaction.editReply(`Jumped to ${queue.songs[postion].name}`)
  }
})