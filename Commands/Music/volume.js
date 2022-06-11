const { Command } = require('reconlx');

module.exports = new Command({
  name: 'volume',
  description: 'Set the player volume',
  userPermissions: [],
  permissions: { client: [], user: [] },
  cooldown: { client: 0, user: 500 },
  category: 'Music',
  options: [{
    name: 'vol',
    description: 'Give me Number between 0 and 200',
    required: true,
    type: 'NUMBER',
    max_value: 200
  }],

  run: async (client, interaction) => {
    const queue = client.musicPlayer.getQueue(interaction.guild.id);
    const volume = interaction.options.getNumber('vol');

    if (!queue?.songs) return interaction.editReply('You need to play music first!')
    if (volume > 200) volume = 200;

    await queue.setVolume(volume);
    interaction.editReply(`The volume has been set to ${volume}%`);
  }
})