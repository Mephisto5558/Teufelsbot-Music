const { Command } = require("reconlx");
const { MessageEmbed } = require("discord.js");
const player = require('../../Handlers/music_player');

module.exports = new Command({
  name: 'queue',
  description: `Show the queue`,
  userPermissions: [],
  cooldown: {global: 0, user: 2000},
  category: "Music",

  run: async (client, interaction) => {
    let member = interaction.guild.members.cache.get(interaction.member.id)
    let queue = player.getQueue(interaction.guild.id)
    if (!queue?.songs) return interaction.followUp(`There are no songs in the queue!`)
  
    let description = queue.songs.map((song, index) => {
      return [
        `\`${index + 1}.\` **[${song.name}](${song.url})** \`[${song.formattedDuration}]\``
      ].join(" ");
    }).join("\n");

    let embedArg1 = description.indexOf('`31.`');
    if (embedArg1 === 0) embedArg1 = 4096
    let embedArg2 = queue.songs.formattedDuration || 'an error occured';
    let embedArg3 = queue.currentTime + ' - ' + queue.formattedDuration || 'an error occured';
    let embed = new MessageEmbed()
      .setTitle('Queue')
      .setDescription(`${description.substr(0, 4096).substr(0, embedArg1) || 'an error occured'}`)
      .addField('Queue Length', embedArg2, true)
      .addField('Current Song', embedArg3, true);

    interaction.followUp({ embeds: [embed] })
  }
})