const { EmbedBuilder, Colors } = require('discord.js');

module.exports = (playerInteraction, content, { asEmbed, asError } = {}) => {
  if (!content) throw new SyntaxError('Missing data to send');

  if (asEmbed) {
    const embed = new EmbedBuilder({
      title: 'Music Player',
      description: content,
      color: Colors.Blurple
    });

    content = { embeds: [embed] };
  }

  if (asError && content.embeds?.length) for (const embed of content.embeds) embed.data.color = Colors.Red;

  try { playerInteraction.editReply(content) }
  catch {
    try { playerInteraction.reply(content) }
    catch { playerInteraction.channel.send(content) }
  }
}
