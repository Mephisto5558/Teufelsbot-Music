const { Command } = require('reconlx');

module.exports = new Command({
  name: 'loop',
  aliases: ['repeat'],
  description: 'Loop a song or the whole queue',
  permissions: { client: [], user: [] },
  cooldown: { global: 0, user: 2000 },
  category: 'Music',
  needsQueue: true,
  options: [
    {
      name: 'song',
      description: 'loop the currently playing song',
      type: 'SUB_COMMAND'
    },
    {
      name: 'queue',
      description: 'loop the current queue',
      type: 'SUB_COMMAND'
    }
  ],

  run: async (player, interaction) => {
    const cmd = interaction.options.getSubcommand();

    await player.queue.setRepeatMode(player.queue.repeatMode > 0 ? 0 : (cmd == 'song' ? 1 : 2));

    editReply(player, `${player.queue.repeatMode > 0 ? 'Disabled' : (cmd == 'song' ? 'Enabled song' : 'Enabled queue')} loop.`, true);
  }
})