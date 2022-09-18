module.exports = {
  name: 'leave',
  aliases: [],
  description: 'Leave the current voice channel',
  permissions: { client: ['EmbedLinks'], user: [] },
  cooldowns: { client: 0, user: 3000 },
  category: 'Music',
  ephemeralDefer: true,

  run: async function (player) {
    if (!player.guild.members.me.voice.channel) return this.editReply(`I'm not connected to a voice channel.`);

    await player.guild.members.me.voice.disconnect();
    await this.editPlayer('I left the voice channel.', { asEmbed: true });
  }
}