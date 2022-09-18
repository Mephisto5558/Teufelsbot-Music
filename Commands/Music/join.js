module.exports = {
  name: 'join',
  aliases: [],
  description: 'Joins the voice channel you are in',
  permissions: { client: ['EmbedLinks'], user: [] },
  cooldowns: { client: 0, user: 3000 },
  category: 'Music',
  needsVC: true,
  ephemeralDefer: true,

  run: async function (_, { musicPlayer }) {
    if (member.voice.channelId == this.guild.members.me.voice.channelId) return this.editReply("I'm already in your voice channel!");

    await musicPlayer.voices.join(this.member.voice.channel);

    this.editPlayer('I joined your voice channel.', { asEmbed: true });
  }
}