module.exports = {
  name: 'join',
  cooldowns: { user: 3000 },
  requireVC: true,

  run: async function (lang) {
    if (this.member.voice.channelId == this.guild.members.me.voice.channelId) return this.editReply(lang('alreadyIn'));

    await this.client.distube.voices.join(this.member.voice.channel);
    this.sendEmbed(lang('success'), { asEmbed: true });
  }
}