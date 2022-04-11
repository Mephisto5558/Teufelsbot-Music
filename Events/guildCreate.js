module.exports = (client, guild) => {
  guild.commands.set(client.slashCommandList);
}