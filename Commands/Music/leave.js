const { Command } = require("reconlx");

module.exports = new Command({
  name: 'leave',
  description: `Leave the current voice channel`,
  userPermissions: [],
  cooldown: {global: 0, user: 3000},
  category: "Music",

  run: async (client, interaction) => {
    
    if (!interaction.guild.me.voice) return interaction.followUp("I'm currently not connected to a voice channel.")
    await interaction.guild.me.voice.disconnect();
    interaction.followUp("left the voice channel");
    
  }
})