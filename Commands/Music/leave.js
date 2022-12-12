module.exports = {
  name: 'leave',
  description: 'Leave the current voice channel',
  cooldowns: { user: 5000 },

  run: async function () {
    if (!this.guild.members.me.voice.channel) return this.editReply(`I'm not connected to a voice channel.`);

    await this.guild.members.me.voice.disconnect();
    this.sendEmbed('I left the voice channel.', { asEmbed: true });
  }
}