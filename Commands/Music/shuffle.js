const { Command } = require('reconlx');

module.exports = new Command({
  name: 'shuffle',
  description: 'Shuffles the queue',
  permissions: { client: [], user: [] },
  cooldown: { client: 0, user: 0 },
  category: 'Music',

  run: async (client, interaction) => {
    const queue = client.musicPlayer.getQueue(interaction.guild.id);
    await queue.shuffle();
    interaction.editReply('Shuffled the queue!');
  }
})