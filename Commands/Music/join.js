const { Command } = require("reconlx");
const { joinVoiceChannel } = require("@discordjs/voice");

module.exports = new Command({
  name: 'join',
  description: `Joins the voice channel you are in`,
  userPermissions: [],
  category: "Music",

  run: async (client, interaction) => {
    await joinVoiceChannel({
      channelId: interaction.member.voice.channelId,
      guildId: interaction.guild.id,
      adapterCreator: interaction.guild.voiceAdapterCreator
    });
    interaction.followUp("I joined your voice channel");
    
  }
})