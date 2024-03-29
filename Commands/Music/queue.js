const { EmbedBuilder, Colors } = require('discord.js');

module.exports = {
  name: 'queue',
  cooldowns: { user: 2000 },
  requireQueue: true,

  run: async function (lang) {
    const
      song = this.musicPlayer.songs[0],
      remainingSongTime = (song.duration - this.musicPlayer.currentTime).toFormattedTime(),
      description = this.musicPlayer.songs.map(({ name, url, formattedDuration }, i) => `**${i + 1}**. [${name.length <= 75 ? name : name.substring(0, 75) + '...'}](${url}) \`[${formattedDuration}]\``).join('\n');

    const embed = new EmbedBuilder({
      title: lang('embedTitle'),
      description: description.length < 4097 ? description : description.substring(0, description.substring(0, 4096).lastIndexOf('\n**')) + '\n**...**',
      color: Colors.Blurple,
      fields: [
        { name: lang('currentSong'), value: `[${song.name.length < 76 ? song.name : song.name.substring(0, 75) + '...'}](${song.url}) ${lang('uploaderInfo', song.uploader.name)} \`${this.musicPlayer.formattedCurrentTime}\` / \`${remainingSongTime}\``, inline: false },
        { name: lang('queueLength'), value: `${lang('songs', this.musicPlayer.songs.length)}, \`${this.musicPlayer.formattedDuration}\``, inline: true }
      ]
    });

    this.editReply({ embeds: [embed] });
  }
};