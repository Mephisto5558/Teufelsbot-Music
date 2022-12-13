module.exports = {
  name: 'leave',
  cooldowns: { user: 5000 },

  run: async function (lang) {
    if (!this.guild.members.me.voice.channel) return this.editReply(`I'm not connected to a voice channel.`);

    await this.guild.members.me.voice.disconnect();
    this.sendEmbed(lang('success'), { asEmbed: true });
  }
}