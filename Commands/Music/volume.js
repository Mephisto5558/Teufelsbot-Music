const { Command } = require('reconlx');

module.exports = new Command({
  name: 'volume',
  aliases: [],
  description: 'Set the player volume',
  permissions: { client: [], user: [] },
  cooldowns: { client: 0, user: 500 },
  category: 'Music',
  needsQueue: true,
  options: [{
    name: 'vol',
    description: 'The new percentage volume',
    required: true,
    type: 'Number',
    maxValue: 200
  }],

  run: async (player, { options }, { functions }) => {
    let volume = options.getNumber('vol');
    if (volume > 200) volume = 200;

    await player.queue.setVolume(volume);
    await functions.editPlayer(player, `The volume has been set to ${volume}%`, { asEmbed: true });
  }
})