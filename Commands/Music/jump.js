const { Command } = require('reconlx');

module.exports = new Command({
  name: 'jump',
  description: 'Jump to a song',
  permissions: { client: [], user: [] },
  cooldown: { client: 1000, user: 2000 },
  category: 'Music',
  needsQueue: true,
  options: [{
    name: 'position',
    description: 'Jump to a Song Number in the queue',
    type: 'NUMBER',
    required: true
  }],

  run: async (player, interaction) => {
    const postion = interaction.options.getNumber('position');

    await player.queue.jump(postion);

    editReply(player, `Jumped to ${player.queue.songs[0].name}`,  true );
  }
})