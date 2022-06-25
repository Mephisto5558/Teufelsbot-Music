const { Command } = require('reconlx');
const { joinVoiceChannel } = require('@discordjs/voice');

module.exports = new Command({
  name: 'join',
  description: 'Joins the voice channel you are in',
  permissions: { client: [], user: [] },
  cooldown: { client: 0, user: 3000 },
  category: 'Music',

  run: async (player, interaction) => {
    if (interaction.member.voice.channelId == interaction.guild.me.voice.channelId) return editReply(player, "I'm already in your voice channel!",  true );

    joinVoiceChannel({
      channelId: interaction.member.voice.channelId,
      guildId: interaction.guild.id,
      adapterCreator: interaction.guild.voiceAdapterCreator
    });

    await editReply(player, 'I joined your voice channel.',  true );
  }
})