const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Colors, ComponentType } = require('discord.js');

module.exports = {
  name: 'play',
  cooldowns: { user: 1000 },
  requireVC: true,
  options: [
    {
      name: 'query',
      type: 'String',
      required: true,
    },
    {
      name: 'type',
      type: 'String',
      choices: ['video', 'playlist']
    },
    { name: 'safe_search', type: 'Boolean' },
    { name: 'skip', type: 'Boolean' },
    { name: 'shuffle', type: 'Boolean' }
  ],

  run: async function (lang) {
    const
      query = this.options.getString('query'),
      rows = [];

    let row = new ActionRowBuilder();

    if (/^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)/i.test(query)) {
      const msg = await this.sendEmbed(lang('global.loading'), { asEmbed: true });

      await this.client.distube.play(this.member.voice.channel, query, {
        member: this.member,
        textChannel: this.channel,
        skip: this.options.getBoolean('skip'),
        metadata: { msg }
      });

      if (this.options.getBoolean('shuffle')) await this.musicPlayer.shuffle();
      return;
    }

    const
      search = await this.client.distube.search(query, {
        type: this.options.getString('type') ?? 'video',
        safeSearch: this.options.getBoolean('safe_search') ?? false,
        limit: 5
      }),
      results = search.reduce((acc, e, i) => {
        if (acc.join('\n').length < 4097) acc.push([`${i + 1}. [${e.name.length < 151 ? e.name : e.name.substring(0, 147) + '...'}](${e.url}) ${e.uploader.name ? lang('uploaderInfo', e.uploader.name) : ''}`, e.url]);
        return acc;
      }, []),
      embed = new EmbedBuilder({
        title: lang('searchEmbedTitle'),
        description: results.map(e => e[0]).join('\n'),
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
        label: lang('global.cancel'),
        style: ButtonStyle.Danger
      })]
    }));

    const msg = await this.editReply({ embeds: [embed], components: rows });

    this.channel.createMessageComponentCollector({ filter: i => i.member.id == this.member.id, componentType: ComponentType.Button, time: 30000 })
      .on('collect', async button => {
        await button.deferUpdate();

        embed.data.title = lang('others.editEmbed.title');
        embed.data.description = button.customId == 'cancel' ? lang('canceled') : lang('loading', results[button.customId - 1][0].replace(/^[^.]*\. /, ''));

        msg.edit({ embeds: [embed], components: [] });

        await this.client.distube.play(this.member.voice.channel, results[button.customId - 1][1], {
          member: this.member,
          textChannel: this.channel,
          skip: this.options.getBoolean('skip'),
          metadata: { msg }
        });

        if (this.options.getBoolean('shuffle')) this.musicPlayer.shuffle();
      })
      .on('end', async collected => {
        if (collected.size) msg.edit({ components: [] });
      });
  }
};