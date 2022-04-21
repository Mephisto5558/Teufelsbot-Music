const { Command } = require("reconlx");
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const player = require('../../Handlers/music_player');

module.exports = new Command({
  name: 'play',
  description: `Play a song`,
  userPermissions: [],
  category: "Music",
  options: [
    {
      name: "query",
      description: "Type the video name or provide a link",
      type: "STRING",
      required: true,
    },
    {
      name: "skip",
      description: "Skip the current song to play your's instant",
      type: "BOOLEAN",
      required: false
    }
  ],

  run: async (_, interaction) => {
    let member = interaction.guild.members.cache.get(interaction.member.id);
    let results = [];
    let interaction0;
    let query = interaction.options.getString('query');
    if(!query) query = interaction.options.getString('song');
    //remove song later

    if(query.includes("youtube.com") || query.includes("youtu.be")) {
      player.play(member.voice.channel, query, {
        member: member,
        textChannel: interaction.channel,
        skip: interaction.options.getBoolean('skip') || false
      });
      interaction0.delete();
      return;
    };
    
    const search = await player.search(query, { type: "video", limit: 5 });
    search.forEach((result) => {
      if(result.name.length > 150) result.name = `${result.name.substring(0,147)}...`;
      results.push(`[${result.name}](${result.url}) by ${result.uploader.name} (${result.formattedDuration})`);
    });

    do {
      results.pop();
    } while(results.join().length > 4096);

    let embed = new MessageEmbed()
      .setTitle('Please select a song. You have 30 seconds.')
      .setDescription(results.join('\r\n'));
    
    let row = new MessageActionRow()
    for(i=1; i < results.length; i++) {
			row.addComponents(new MessageButton()
				.setCustomId(i.toString())
				.setLabel(i.toString())
				.setStyle('PRIMARY')
      )
    };

		await interaction.followUp({ embeds: [embed], components: [row] }).then(msg => {interaction0 = msg});

    const filter = i => i.member.id === interaction.member.id;
    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 30000 });

    collector.on('collect', interaction2 => {
      player.play(member.voice.channel, results[interaction2.customId], {
        member: member,
        textChannel: interaction.channel,
        skip: interaction.options.getBoolean('skip') || false
      });
      interaction0.delete();
	  })
    collector.on('end', _ => { interaction0.delete(); })
  }
})