const { Command } = require('reconlx');
const { joinVoiceChannel } = require('@discordjs/voice');

module.exports = new Command({
  name: 'join',
  description: 'Joins the voice channel you are in',
  permissions: { client: [], user: [] },
  cooldown: { client: 0, user: 3000 },
  category: 'Music',

  run: (_, interaction) => {
    joinVoiceChannel({
      channelId: interaction.member.voice.channelId,
      guildId: interaction.guild.id,
      adapterCreator: interaction.guild.voiceAdapterCreator
    });

    interaction.editReply('I joined your voice channel');
  }
})