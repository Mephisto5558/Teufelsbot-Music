const { Command } = require('reconlx');

module.exports = new Command({
  name: 'loop',
  aliases: 'repeat',
  description: 'Loop a song or the whole queue',
  permissions: { client: [], user: [] },
  cooldown: { global: 0, user: 2000 },
  category: 'Music',
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

  run: async (client, interaction) => {
    const cmd = interaction.options.getSubcommand();
    const queue = client.musicPlayer.getQueue(interaction.guild.id);

    if (!queue) return interaction.followUp('You need to play music first!');

    if (cmd == 'song') {
      if (queue.repeatMode == 1) await queue.setRepeatMode(0);
      else await queue.setRepeatMode(1);
    }
    else if (cmd == 'queue') {
      if (queue.repeatMode == 2) await queue.setRepeatMode(0);
      else await queue.setRepeatMode(2);
    }

    interaction.editReply(`${cmd == 'song' ? 'Song' : 'Queue'} loop ${queue.repeatMode == 0 ? 'disabled' : 'enabled'}`);
  }
})