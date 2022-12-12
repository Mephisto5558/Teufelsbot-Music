module.exports = {
  name: 'join',
  description: 'Joins the voice channel you are in',
  cooldowns: { user: 3000 },
  requireVC: true,

  run: async function () {
    if (this.member.voice.channelId == this.guild.members.me.voice.channelId) return this.editReply("I'm already in your voice channel!");

    await this.client.distube.voices.join(this.member.voice.channel);
    this.sendEmbed('I joined your voice channel.', { asEmbed: true });
  }
}