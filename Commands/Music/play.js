const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Colors, ComponentType } = require('discord.js');

module.exports = {
  name: 'play',
  aliases: [],
  description: 'plays a song',
  permissions: { client: ['EmbedLinks'], user: [] },
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

  run: async function (player, { musicPlayer }) {
    const query = this.options.getString('query');

    let
      rows = [],
      row = new ActionRowBuilder(),
      results = [],
      i = 1;

    if (this.options.getBoolean('use_this_interaction')) player = this;

    if (/^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)/i.test(query)) {
      const msg = await functions.editPlayer(player, 'Loading...', { asEmbed: true });

      if (this.id == player.id) musicPlayer.interaction.set(this.guild.id, msg);

      await musicPlayer.play(this.member.voice.channel, query, {
        member: this.member,
        textChannel: this.channel,
        skip: this.options.getBoolean('skip')
      });


      if (this.options.getBoolean('shuffle')) {
        const queue = musicPlayer.getQueue(this.guild.id);
        await queue.shuffle();
      }

      return;
    }

    const search = await musicPlayer.search(query, {
      type: this.options.getString('type') || 'video',
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

    const filter = i => i.member.id == this.member.id;
    const collector = this.channel.createMessageComponentCollector({ filter, componentType: ComponentType.Button, time: 30000 });

    collector.on('collect', async button => {
      await button.deferUpdate();

      embed.data.title = 'Music Player';

      if (button.customId == 'cancel') embed.data.description = 'Command canceled.';
      else embed.data.description = `Loading ${results[button.customId - 1].replace(/^.*\. /, '')}...`;

      const msg = await functions.editPlayer(player, { embeds: [embed], components: [] });

      if (this.id == player.id) musicPlayer.interaction.set(this.guild.id, msg);

      if (button.customId == 'cancel' && musicPlayer.getQueue(this.guild.id)?.songs?.length)
        return require('./nowplaying.js').run.call(this, player);

      await musicPlayer.play(this.member.voice.channel, /\((.*)\)/g.exec(results[button.customId - 1])[1], {
        member: this.member,
        textChannel: this.channel,
        skip: this.options.getBoolean('skip')
      });

      if (this.options.getBoolean('shuffle')) {
        const queue = musicPlayer.getQueue(this.guild.id);
        await queue.shuffle();
      }
    });

    collector.on('end', async collected => {
      if (collected.size) return;
      this.editPlayer({ components: [] });
    });

  }
}