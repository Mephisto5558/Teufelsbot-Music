const { EmbedBuilder, Colors } = require('discord.js');

module.exports = (interaction, content, asEmbed, asError) => {
  if (!content) throw new SyntaxError('Missing data to send');

  if (asEmbed) {
    const embed = new EmbedBuilder({
      title: 'Music Player',
      description: content,
      color: asError ? Colors.Red : Colors.Blurple
    });

    content = { embeds: [embed] };
  }

  if (typeof content == 'object') {
    for (const item of Object.entries(content))
      if (item[1] && ['embeds', 'files', 'attachments', 'components'].includes(item[0]) && !item[1]?.[0])
        item[1] = Array(item[1]);

    if (asError) for (const embed of content.embeds) embed.data.color = Colors.Red;
  }

  try { return interaction.editReply(content) }
  catch { interaction.reply(content) }
}
