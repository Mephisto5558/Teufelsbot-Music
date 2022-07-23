const
  { Command } = require('reconlx'),
  { EmbedBuilder, Colors } = require('discord.js');

module.exports = new Command({
  name: 'ping',
  aliases: [],
  description: `Get the bot's ping`,
  usage: '',
  permissions: { client: [], user: [] },
  cooldowns: { global: '', user: '' },
  category: 'Information',
  options: [{
    name: 'average',
    description: 'Gets the ping average',
    type: 'Boolean',
    required: false
  }],

  run: async (_, interaction, client) => {
    if (interaction.options?.getBoolean('average')) {
      const embed = new EmbedBuilder({
        title: 'Ping',
        description: `Pinging... (this takes about one minute)`,
        color: Colors.Blurple
      });

      interaction.editReply({ embeds: [embed] });

      let pings = [], i;

      for (i = 0; i <= 59; i++) {
        pings.push(client.ws.ping);
        await client.functions.sleep(1000);
      }

      pings.sort((a, b) => a - b);

      const averagePing = Math.round((pings.reduce((a, b) => a + b) / i) * 100) / 100;

      embed
        .setDescription(
          `Pings: \`${pings.length}\`\n` +
          `Lowest Ping: \`${pings[0]}ms\`\n` +
          `Highest Ping: \`${pings[pings.length - 1]}ms\`\n` +
          `Average Ping: \`${averagePing}ms\``
        )

      return interaction.editReply({ embeds: [embed] })
    }

    const ping = Math.abs(Date.now() - interaction.createdTimestamp);

    const embed = new EmbedBuilder({
      title: 'Ping',
      description:
        `Latency: \`${ping}ms\`\n` +
        `API Latency: \`${Math.round(client.ws.ping)}ms\``,
      color: Colors.Blurple
    });

    interaction.editReply({ embeds: [embed] });
  }
})