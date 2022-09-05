module.exports = {
  name: 'loop',
  aliases: ['repeat'],
  description: 'Loop a song or the whole queue',
  permissions: { client: ['EmbedLinks'], user: [] },
  cooldowns: { global: 0, user: 2000 },
  category: 'Music',
  needsVC: true,
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

  run: async (player, { options }, { functions }) => {
    const cmd = options.getSubcommand();
    const repeatMode = cmd == 'song' ? [1, 'Enabled song'] : [2, 'Enabled queue'];

    await player.queue.setRepeatMode(player.queue.repeatMode > 0 ? 0 : repeatMode[0]);
    functions.editPlayer(player, `${player.queue.repeatMode == 0 ? 'Disabled' : repeatMode[1]} loop.`, { asEmbed: true });
  }
}