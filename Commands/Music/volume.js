const { Command } = require('reconlx');

module.exports = new Command({
  name: 'volume',
  description: 'Set the player volume',
  userPermissions: [],
  permissions: { client: [], user: [] },
  cooldown: { client: 0, user: 500 },
  category: 'Music',
  needsQueue: true, 
  options: [{
    name: 'vol',
    description: 'Give me Number between 0 and 200',
    required: true,
    type: 'NUMBER',
    max_value: 200
  }],

  run: async (player, interaction) => {
    let volume = interaction.options.getNumber('vol');
    if (volume > 200) volume = 200;

    await player.queue.setVolume(volume);
    await editReply(player, `The volume has been set to ${volume}%`,  true );
  }
})