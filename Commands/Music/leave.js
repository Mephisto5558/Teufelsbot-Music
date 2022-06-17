const { Command } = require('reconlx');

module.exports = new Command({
  name: 'leave',
  description: 'Leave the current voice channel',
  permissions: { client: [], user: [] },
  cooldown: { client: 0, user: 3000},
  category: 'Music',

  run: async player => {
    if (!player.guild.me.voice) return editReply(player, `I'm not connected to a voice channel.`,  true );

    await player.guild.me.voice.disconnect();
    editReply(player, 'I left the voice channel.',  true );
  }
})