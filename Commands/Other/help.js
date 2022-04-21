const { Command } = require("reconlx");
const { MessageEmbed } = require("discord.js");
const configEmbed = require('../../Settings/embed.json')

module.exports = new Command({
  name: 'help',
  aliases: [],
  description: `Shows all bot commands`,
  userPermissions: [],
  category: "Information",
  showInHelp: false,
  options: [{
    name: "command",
    description: "Type a command here to search for it",
    type: "STRING",
    required: false
  }],
  
  run: async (client, interaction) => {
    if(!interaction) return client.functions.reply('Please use `/ping`!', message, 10000);
    
    args = interaction.options?.getString('command');

    if(args) {
      const embed = new MessageEmbed();
      const cmd = client.commands.get(args.toLowerCase())
      if(!cmd) return client.channels.cache.get(interaction.channelId).send({ embeds: [embed.setColor(configEmbed.embed_wrongcolor).setDescription(`No Information found for command **${args.toLowerCase()}**`)] });
      if(cmd.name) {
        embed.addField("**Command name**", `\`${cmd.name}\``);
        embed.setTitle(`Detailed Information about: \`${cmd.name}\``);
      }
      if(cmd.alias) embed.addField("Alias", `\`${cmd.alias}\``);
      if(cmd.description) embed.addField("**Description**", `\`${cmd.description}\``);
      if(cmd.usage) {
        embed.addField("**Usage**", `\`${prefix}${cmd.usage}\``);
        embed.setFooter("Syntax: <> = required, [] = optional");
      }
        
      return client.channels.cache.get(interaction.channelId).send({ embeds: [embed.setColor(configEmbed.embed_color)] });
    }
    
    let embed = new MessageEmbed()
      .setColor(configEmbed.embed_color)
      .setTitle(`Music Module`)

    const commands = category => {
        return client.commands.filter((cmd) => cmd.category === category).filter((cmd) => cmd.hideInHelp != true).map((cmd) => `\`${cmd.name}\``);
    }
        
    for (let i = 0; i < client.categories.length; i += 1) {
      const current = client.categories[i];
      const items = commands(current);
      if(items.length === 0) continue;
      embed.addField(`**${current.toUpperCase()} [${items.length}]**`, `> ${items.join(", ")}`);
    }

    client.channels.cache.get(interaction.channelId).send({ embeds: [embed], ephemeral: true });
  }
})