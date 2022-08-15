const { Command } = require('reconlx');

module.exports = new Command({
  name: 'join',
  aliases: [],
  description: 'Joins the voice channel you are in',
  permissions: { client: [], user: [] },
  cooldowns: { client: 0, user: 3000 },
  category: 'Music',
  needsVC: true,
  ephemeralDefer: true,

  run: async (player, { member, guild }, { functions, musicPlayer }) => {
    if (member.voice.channelId == guild.members.me.voice.channelId) return interaction.editReply("I'm already in your voice channel!");

    await musicPlayer.voices.join(member.voice.channel);

    functions.editPlayer(player, 'I joined your voice channel.', { asEmbed: true });
  }
})