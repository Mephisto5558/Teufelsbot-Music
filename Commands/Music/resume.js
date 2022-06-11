const { Command } = require('reconlx');

module.exports = new Command({
  name: 'resume',
  description: 'Resumes the player',
  permissions: { client: [], user: [] },
  cooldown: { client: 0, user: 2000 },
  category: 'Music',

  run: async (client, interaction) => {
    const queue = client.musicPlayer.getQueue(interaction.guild.id);

    if (!queue?.songs) return interaction.editReply('There are no Songs in the queue!');
    if (!queue.paused) return interaction.editReply('The Player is not paused!');

    await queue.resume();
    interaction.editReply('Player resumed');
  }
})