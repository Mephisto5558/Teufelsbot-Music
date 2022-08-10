const
  { Command } = require('reconlx'),
  { EmbedBuilder, Colors } = require('discord.js');

module.exports = new Command({
  name: 'ping',
  aliases: [],
  description: `Get the bot's ping`,
  usage: '',
  permissions: { client: ['EmbedLinks'], user: [] },
  cooldowns: { guild: 0, user: 1000 },
  category: 'Information',
  options: [{
    name: 'average',
    description: 'Gets the ping average',
    type: 'Boolean',
    required: false
  }],

  run: async (_, interaction, { ws, functions }) => {
    if (interaction?.options?.getBoolean('average')) {
      const embed = new EmbedBuilder({
        title: 'Ping',
        description: `Pinging... (this takes about one minute)`,
        color: Colors.Blurple
      });

      interaction.editReply({ embeds: [embed] });

      let pings = [], i;

      for (i = 0; i <= 59; i++) {
        pings.push(ws.ping);
        await functions.sleep(1000);
      }

      pings.sort((a, b) => a - b);

      const averagePing = Math.round((pings.reduce((a, b) => a + b) / i) * 100) / 100;

      embed.data.description =
        `Pings: \`${pings.length}\`\n` +
        `Lowest Ping: \`${pings[0]}ms\`\n` +
        `Highest Ping: \`${pings[pings.length - 1]}ms\`\n` +
        `Average Ping: \`${averagePing}ms\``;

      return interaction.editReply({ embeds: [embed] })
    }

    const embed = new EmbedBuilder({
      title: 'Ping',
      description: 'Loading...',
      color: Colors.Green
    });

    const messagePing = Date.now();
    await interaction.editReply({ embeds: [embed] });
    const endMessagePing = Date.now() - messagePing;

    embed.data.fields = [
      { name: 'API', value: `\`${Math.round(ws.ping)}\`ms`, inline: true },
      { name: 'Bot', value: `\`${Math.abs(Date.now() - interaction.createdTimestamp)}\`ms`, inline: true },
      { name: 'Message Send', value: `\`${endMessagePing}\`ms`, inline: true }
    ];
    embed.data.description = ' ';

    interaction.editReply({ embeds: [embed] });
  }
})
