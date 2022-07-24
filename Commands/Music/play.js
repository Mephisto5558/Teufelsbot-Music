const
  { Command } = require('reconlx'),
  { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Colors, ComponentType } = require('discord.js');

module.exports = new Command({
  name: 'play',
  aliases: [],
  description: 'plays a song',
  permissions: { client: [], user: [] },
  cooldowns: { global: 0, user: 1000 },
  category: 'Music',
  needsVC: true,
  options: [
    {
      name: 'query',
      description: 'Type the video name or provide a link',
      type: 'String',
      required: true,
    },
    {
      name: 'type',
      description: 'The type of search results you want',
      type: 'String',
      required: false,
      choices: [
        { name: 'video', value: 'video' },
        { name: 'playlist', value: 'playlist' }
      ]
    },
    {
      name: 'skip',
      description: "Skip the current song to play your's instant",
      type: 'Boolean',
      required: false
    },
    {
      name: 'shuffle',
      description: 'shuffle the queue',
      type: 'Boolean',
      required: false
    },
    {
      name: 'use_this_interaction',
      description: 'Change the player embed to this interaction',
      type: 'Boolean',
      required: false
    }
  ],

  run: async (player, interaction, { musicPlayer, functions }) => {
    const query = interaction.options.getString('query');

    let
      rows = [],
      row = new ActionRowBuilder(),
      results = [],
      i = 1;

    if (interaction.options.getBoolean('use_this_interaction')) player = interaction;

    if (/^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)/i.test(query)) {
      return await musicPlayer.play(interaction.member.voice.channel, query, {
        member: interaction.member,
        textChannel: interaction.channel,
        skip: interaction.options.getBoolean('skip')
      })
    }

    const search = await musicPlayer.search(query, {
      type: interaction.options.getString('type') || 'video',
      limit: 5
    });

    for (const result of search) {
      if (results.join().length > 4096) break;

      if (result.name.length > 150) result.name = `${result.name.substring(0, 147)}...`;

      results.push(`${i++}. [${result.name}](${result.url}) ${result.uploader.name ? `by ${result.uploader.name}` : ''}`);
    }

    const embed = new EmbedBuilder({
      title: 'Please select a song.',
      description: results.join('\n'),
      color: Colors.Blurple
    });

    for (let i = 0; i < results.length; i++) {
      if (i % 5 == 4) {
        rows.push(row);
        row = new ActionRowBuilder();
      }

      row.components.push(new ButtonBuilder({
        customId: i.toString(),
        label: i.toString(),
        style: ButtonStyle.Primary
      }));
    }

    rows.push(row, new ActionRowBuilder({
      components: [new ButtonBuilder({
        customId: 'cancel',
        label: 'Cancel',
        style: 'DANGER'
      })]
    }));

    await functions.editPlayer(player, { embeds: [embed], components: rows });

    const filter = i => i.member.id == interaction.member.id;
    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 30000, componentType: ComponentType.Button });

    collector.on('collect', async button => {
      await button.deferUpdate();
      collector.stop();

      if (interaction.id == player.id) musicPlayer.interaction.set(interaction.guild.id, interaction);

      for (const row of rows)
        for (const button of row.components)
          button.setDisabled(true);

      if (button.customId != 'cancel') embed.data.description = `Loading ${results[button.customId - 1]}...`;
      await functions.editPlayer(player, { embeds: [embed], components: rows });

      if (button.customId == 'cancel') return;

      await musicPlayer.play(interaction.member.voice.channel, results[button.customId - 1].match(/\((.*)\)/g)[0], {
        member: interaction.member,
        textChannel: interaction.channel,
        skip: interaction.options.getBoolean('skip')
      });

      const queue = musicPlayer.getQueue(interaction.guild.id);

      if (interaction.options.getBoolean('shuffle')) await queue.shuffle();
    });

    collector.on('end', async collected => {
      if ((collected.size && collected.first().customId != 'cancel') || musicPlayer.getQueue(interaction.guild.id)) return;

      await functions.sleep(15000);
      player.deleteReply();
    })

  }
})