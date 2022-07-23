const { Command } = require('reconlx');

module.exports = new Command({
  name: 'loop',
  aliases: ['repeat'],
  description: 'Loop a song or the whole queue',
  permissions: { client: [], user: [] },
  cooldowns: { global: 0, user: 2000 },
  category: 'Music',
  needsQueue: true,
  options: [
    {
      name: 'song',
      description: 'loop the currently playing song',
      type: 'Subcommand'
    },
    {
      name: 'queue',
      description: 'loop the current queue',
      type: 'Subcommand'
    }
  ],

  run: async (player, { options }) => {
    const cmd = options.getSubcommand();

    await player.queue.setRepeatMode(player.queue.repeatMode > 0 ? 0 : (cmd == 'song' ? 1 : 2));

    await client.functions.editPlayer(player, `${player.queue.repeatMode > 0 ? 'Disabled' : (cmd == 'song' ? 'Enabled song' : 'Enabled queue')} loop.`, true);
  }
})