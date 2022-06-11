const
  { Command } = require('reconlx'),
  { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

module.exports = new Command({
  name: 'play',
  description: 'plays a song',
  permissions: { client: [], user: [] },
  cooldown: { global: 0, user: 1000 },
  category: 'Music',
  options: [
    {
      name: 'query',
      description: 'Type the video name or provide a link',
      type: 'STRING',
      required: true,
    },
    {
      name: 'skip',
      description: "Skip the current song to play your's instant",
      type: 'BOOLEAN',
      required: false
    }
  ],

  run: async (client, interaction) => {
    const query = interaction.options.getString('query');

    let
      rows = [],
      row = new MessageActionRow(),
      results = [],
      interaction0,
      i = 1;

    if (/^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)/i.test(query)) {
      return await client.musicPlayer.play(interaction.member.voice.channel, query, {
        member: interaction.member,
        textChannel: interaction.channel,
        skip: interaction.options.getBoolean('skip') || false
      })
    }

    const search = await client.musicPlayer.search(query, { type: 'video', limit: 5 });

    for (const result of search) {
      if(results.join().length > 4096) {
        results.pop();
        break;
      }

      if (result.name.length > 150) result.name = `${result.name.substring(0, 147)}...`;

      results.push(`${i++}. [${result.name}](${result.url}) by ${result.uploader.name}`);
    }

    const embed = new MessageEmbed()
      .setTitle('Please select a song. You have 30 seconds.')
      .setDescription(results.join('\n'));

    for (let i = 1; i < results.length; i++) {
      if (i == 6) {
        rows.push(row);
        row = new MessageActionRow()
      }
      row.addComponents(new MessageButton()
        .setCustomId(i.toString())
        .setLabel(i.toString())
        .setStyle('PRIMARY')
      )
    }

    rows.push(row);
    rows.push(
      new MessageActionRow().addComponents(
        new MessageButton()
          .setCustomId('cancel')
          .setLabel('Cancel')
          .setStyle('DANGER')
      )
    );

    await interaction.editReply({ embeds: [embed], components: rows })
      .then(msg => interaction0 = msg);

    const filter = i => i.member.id == interaction.member.id;
    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 30000 });

    collector.on('collect', async interaction2 => {
      interaction2.deferUpdate();
      collector.stop();

      for (const row of rows) {
        for (const button of row.components) {
          button.setDisabled(true);
        }
      }

      interaction.editReply({ embeds: [embed], components: rows });

      if (interaction2.customId == 'cancel') return;

      await client.musicPlayer.play(interaction.member.voice.channel, results[interaction2.customId - 1], {
        member: interaction.member,
        textChannel: interaction.channel,
        skip: interaction.options.getBoolean('skip') || false
      })
    });

    collector.on('end', async _ => {
      await client.sleep(15000);
      interaction0.delete();
    })

  }
})