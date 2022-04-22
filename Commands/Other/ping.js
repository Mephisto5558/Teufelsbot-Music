const { Command } = require("reconlx");
const { MessageEmbed } = require("discord.js");
const embedConfig = require('../../Settings/embed.json')

module.exports = new Command({
  name: 'ping',
  description: `Show the bot's ping`,
  userPermissions: [],
  category: "Information",
  showInHelp: false,
  disabled: false,
  run: (client, interaction) => {

    if (!interaction) return;

    let embed = new MessageEmbed()
      .setColor(embedConfig.embed_color)
      .setTitle('Music Module')
      .setDescription(
        `Latency: \`${Math.abs(Date.now() - interaction.createdTimestamp)}ms\`\n` +
        `API Latency: \`${Math.round(client.ws.ping)}ms\``
      )
    client.channels.cache.get(interaction.channelId).reply({ embeds: [embed] });
  }
})