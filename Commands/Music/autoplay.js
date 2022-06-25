const { Command } = require('reconlx');

module.exports = new Command({
  name: 'autoplay',
  description: 'toggles YouTube autoplay',
  permissions: { client: [], user: [] },
  cooldown: { client: 0, user: 2000 },
  category: 'Music',
  needsQueue: true,
  disabled: true,

  run: async player => {
    await player.queue.toggleAutoplay();

    await editReply(player, `Autoplay has been ${player.queue.autoplay ? 'enabled' : 'disabled'}.`, true);
  }
})