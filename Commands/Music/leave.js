const { Command } = require('reconlx');

module.exports = new Command({
  name: 'leave',
  aliases: [],
  description: 'Leave the current voice channel',
  permissions: { client: [], user: [] },
  cooldowns: { client: 0, user: 3000 },
  category: 'Music',

  run: async (player, _, { functions }) => {
    if (!player.guild.members.me.voice.channel) return functions.editPlayer(player, `I'm not connected to a voice channel.`, true);

    await player.guild.members.me.voice.disconnect();
    await functions.editPlayer(player, 'I left the voice channel.', true);
  }
})