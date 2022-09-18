module.exports = {
  name: 'volume',
  aliases: [],
  description: 'Set the player volume',
  permissions: { client: ['EmbedLinks'], user: [] },
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

  run: async function (player) {
    let volume = this.options.getNumber('vol');
    if (volume > 200) volume = 200;

    await player.queue.setVolume(volume);
    this.editPlayer(`The volume has been set to ${volume}%`, { asEmbed: true });
  }
}