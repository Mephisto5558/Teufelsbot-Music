const { EmbedBuilder, Colors } = require('discord.js');

module.exports = async function sendEmbed(options, { asEmbed, asError } = {}) {
  if (!options) throw new Error('Missing data to send');

  if (asEmbed) {
    const embed = new EmbedBuilder({
      title: 'Music Player',
      description: options,
      color: asError ? Colors.Red : Colors.Blurple
    });

    options = { embeds: [embed] };
  };

  let msg;

  try { msg = await ((this.replied || this.deferred) ? this.editReply(options) : this.reply(options)); }
  catch {
    try { msg = await this.followUp(options); }
    catch { msg = await this.channel.send(options); }
  }
  return msg;
};
