const { EmbedBuilder, Colors } = require('discord.js');

module.exports = function editPlayer(content, { asEmbed, asError } = {}) {
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

  try { return this.edit(content) }
  catch {
    try { return this.followUp(content) }
    catch { return this.channel.send(content) }
  }
}
