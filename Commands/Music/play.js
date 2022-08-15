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
      description: 'shuffle the queue after adding the song(s)',
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
      functions.editPlayer(player, 'Loading...', { asEmbed: true });

      if (interaction.id == player.id) musicPlayer.interaction.set(interaction.guild.id, interaction);

      await musicPlayer.play(interaction.member.voice.channel, query, {
        member: interaction.member,
        textChannel: interaction.channel,
        skip: interaction.options.getBoolean('skip')
      });


      if (interaction.options.getBoolean('shuffle')) {
        const queue = musicPlayer.getQueue(interaction.guild.id);
        await queue.shuffle();
      }

      return;
    }

    const search = await musicPlayer.search(query, {
      type: interaction.options.getString('type') || 'video',
      limit: 5
    });

    for (const result of search) {
      if (results.join().length > 4096) break;
      if (result.name.length > 150) result.name = `${result.name.substring(0, 147)}...`;

      const uploader = result.uploader.name ? `by ${result.uploader.name}` : '';
      results.push(`${i++}. [${result.name}](${result.url}) ${uploader}`);
    }

    const embed = new EmbedBuilder({
      title: 'Please select a song.',
      description: results.join('\n'),
      color: Colors.Blurple
    });

    for (let i = 1; i <= results.length; i++) {
      if (i > 1 && i % 5 == 1) {
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
        style: ButtonStyle.Danger
      })]
    }));

    await functions.editPlayer(player, { embeds: [embed], components: rows });

    const filter = i => i.member.id == interaction.member.id;
    const collector = interaction.channel.createMessageComponentCollector({ filter, componentType: ComponentType.Button, time: 30000 });

    collector.on('collect', async button => {
      await button.deferUpdate();

      embed.data.title = 'Music Player';

      if (interaction.id == player.id) musicPlayer.interaction.set(interaction.guild.id, interaction);

      if (button.customId == 'cancel') embed.data.description = 'Command canceled.';
      else embed.data.description = `Loading ${results[button.customId - 1].replace(/^.*\. /, '')}...`;

      functions.editPlayer(player, { embeds: [embed], components: [] });

      if (button.customId == 'cancel' && musicPlayer.getQueue(interaction.guild.id)?.songs?.length)
        return require('./nowplaying.js').run(player, interaction, { functions });

      await musicPlayer.play(interaction.member.voice.channel, /\((.*)\)/g.exec(results[button.customId - 1])[1], {
        member: interaction.member,
        textChannel: interaction.channel,
        skip: interaction.options.getBoolean('skip')
      });

      if (interaction.options.getBoolean('shuffle')) {
        const queue = musicPlayer.getQueue(interaction.guild.id);
        await queue.shuffle();
      }
    });

    collector.on('end', async collected => {
      if (collected.size) return;
      functions.editPlayer(player, { components: [] });
    });

  }
})