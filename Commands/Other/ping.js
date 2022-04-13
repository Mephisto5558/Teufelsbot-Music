const { Command } = require("reconlx");
const { MessageEmbed } = require("discord.js");
const embedConfig = require('../../Settings/embed.json')

module.exports = new Command({
  name: 'ping',
  description: `Show the bot's ping`,
  userPermissions: [],
  category : "Information",
  showInHelp: false,
  run: (client, interaction) => {

    if(!interaction) return console.log('Error in ping.js');
    cmdCreatedTimestamp = Math.abs(Date.now() - interaction.createdTimestamp)

    const filter = message => message.author.id === client.userID
    const collector = interaction.channel.createMessageCollector(filter, {max: 10, time: 10000})
    collector.once('collect', () => {
      let embed = new MessageEmbed()
        .setColor(embedConfig.embed_color)
        .setTitle('Music Module')
        .setDescription(
          `Latency: \`${cmdCreatedTimestamp}ms\`\n` + 
          `API Latency: \`${Math.round(client.ws.ping)}ms\``
        )
      client.channels.get(interaction.channelId).send({embeds: [embed]})
    })
  }
})