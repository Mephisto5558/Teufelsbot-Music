module.exports = {
  name: 'volume',
  description: 'Set the player volume',
  cooldowns: { user: 500 },
  requireVC: true,
  requireQueue: true,
  options: [{
    name: 'volume',
    description: 'The new volume percentage',
    type: 'Number',
    required: true,
    minValue: 0,
    maxValue: 500
  }],

  run: async function (player) {
    const volume = this.options.getNumber('volume');

    await player.queue.setVolume(volume);
    this.sendEmbed(`The volume has been set to ${volume}%`, { asEmbed: true });
  }
}