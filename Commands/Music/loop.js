const { Command } = require('reconlx');

module.exports = new Command({
  name: 'loop',
  aliases: 'repeat',
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

    if (cmd == 'song') {
      if (player.queue.repeatMode == 1) await player.queue.setRepeatMode(0);
      else await player.queue.setRepeatMode(1);
    }
    else if (cmd == 'queue') {
      if (player.queue.repeatMode == 2) await player.queue.setRepeatMode(0);
      else await player.queue.setRepeatMode(2);
    }

    editReply(player, `${cmd == 'song' ? 'Song' : 'Queue'} loop ${player.queue.repeatMode == 0 ? 'disabled' : 'enabled'}`,  true );
  }
})