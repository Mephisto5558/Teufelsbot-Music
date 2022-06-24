const
  { Command } = require('reconlx'),
  { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js'),
  { colors } = require('../../Settings/embed.json');

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
      name: 'type',
      description: 'The type of search results you want',
      type: 'STRING',
      required: false,
      choices: [
        { name: 'video', value: 'video' },
        { name: 'playlist', value: 'playlist' }
      ]
    },
    {
      name: 'skip',
      description: "Skip the current song to play your's instant",
      type: 'BOOLEAN',
      required: false
    },
   /* {
      name: 'autoplay',
      description: 'Use the YouTube autoplay feature after this song',
      type: 'BOOLEAN',
      required: false
    }, */
    {
      name: 'use_this_interaction',
      description: 'Change the player interaction to this one',
      type: 'BOOLEAN',
      required: false
    }
  ],

  run: async (player, interaction, client) => {
    const query = interaction.options.getString('query');
    const autoplay = interaction.options.getBoolean('autoplay');

    let
      rows = [],
      row = new MessageActionRow(),
      results = [],
      i = 1;

    if (interaction.options.getBoolean('use_this_interaction')) player = interaction;

    if (/^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)/i.test(query)) {
      return await client.musicPlayer.play(interaction.member.voice.channel, query, {
        member: interaction.member,
        textChannel: interaction.channel,
        skip: interaction.options.getBoolean('skip') || false
      })
    }

    const search = await client.musicPlayer.search(query, {
      type: interaction.options.getString('type') || 'video',
      limit: 5
    });

    for (const result of search) {
      if (results.join().length > 4096) break;

      if (result.name.length > 150) result.name = `${result.name.substring(0, 147)}...`;

      results.push(`${i++}. [${result.name}](${result.url}) by ${result.uploader.name}`);
    }

    const embed = new MessageEmbed()
      .setTitle('Please select a song.')
      .setDescription(results.join('\n'))
      .setColor(colors.discord.BURPLE);

    for (let i = 1; i <= results.length; i++) {
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

    await editReply(player, { embeds: [embed], components: rows });

    const filter = i => i.member.id == interaction.member.id;
    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 30000 });

    collector.on('collect', async button => {
      await button.deferUpdate();
      collector.stop();

      if (interaction.id == player.id) client.musicPlayer.interaction.set(interaction.guild.id, interaction);

      for (const row of rows) {
        for (const button of row.components) {
          button.setDisabled(true);
        }
      }

      editReply(player, { embeds: [embed], components: rows });

      if (button.customId == 'cancel') return;

      await client.musicPlayer.play(interaction.member.voice.channel, results[button.customId - 1], {
        member: interaction.member,
        textChannel: interaction.channel,
        skip: interaction.options.getBoolean('skip') || false
      });

      if (autoplay || autoplay === false) {
        const queue = client.musicPlayer.getQueue(interaction.guild.id);
        if ((autoplay && !queue.autoplay) || (!autoplay && queue.autoplay)) queue.toggleAutoplay();
      }
    });

    collector.on('end', async collected => {
      if ((collected.size && collected.toJSON()[0].customId != 'cancel') || client.musicPlayer.getQueue(interaction.guild.id)) return;

      await client.sleep(15000);
      player.deleteReply();
    })

  }
})