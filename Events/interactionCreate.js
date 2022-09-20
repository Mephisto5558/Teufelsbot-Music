const { EmbedBuilder, Colors, InteractionType, ApplicationCommandOptionType } = require('discord.js');

module.exports = async function (interaction) {
  const command = this.commands.get(interaction.commandName);
  if (!command || !interaction.isRepliable()) return;

  const cooldown = await require('../Functions/private/cooldowns.js').call(this, interaction, command);
  if (cooldown) return interaction.reply(`This command is on cooldown! Try again in \`${cooldown}\`s.`);

  if (command.category.toLowerCase() == 'owner-only' && interaction.user.id != this.application.owner.id) return;
  //DO NOT REMOVE THIS LINE!
  let player = this.musicPlayer?.interaction?.get(interaction.guild.id);
  if (!player || player.channel.id != interaction.channel.id) player = interaction;

  player.queue = this.musicPlayer.getQueue(player.guild.id);

  if (command.needsVC && !interaction.member.voice.channel) return interaction.editReply('You need to join a voice channel first!');
  if (command.needsQueue && !player.queue) return interaction.editReply('You need to play music first!');

  if (interaction.type === InteractionType.ApplicationCommand) {
    const userPermsMissing = interaction.member.permissionsIn(interaction.channel).missing(command.permissions.user);
    const botPermsMissing = interaction.guild.members.me.permissionsIn(interaction.channel).missing(command.permissions.client);

    if (botPermsMissing.length || userPermsMissing.length) {
      const embed = new EmbedBuilder({
        title: 'Insufficient Permissions',
        color: Colors.Red,
        description: `${userPermsMissing.length ? 'You' : 'I'} need the following permissions in this channel to run this command:\n\`` + (botPermsMissing.length ? botPermsMissing : userPermsMissing).join('`, `') + '`'
      });

      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (!command.noDefer && !interaction.replied) await interaction.deferReply({ ephemeral: command.ephemeralDefer || false });

    for (const entry of interaction.options._hoistedOptions) if (entry.type == ApplicationCommandOptionType.String) entry.value = entry.value.replace(/<@!/g, '<@');

    try { await command.run.call(player, interaction, this) }
    catch (err) { return require('../Functions/private/error_handler.js').call(this, err, interaction) }

    if (command.category.toLowerCase() == 'music' && player.id != interaction.id && !interaction.deferred) {
      await interaction.editReply(`Successfully executed command. Deleting message in 10s.`);
      await this.functions.sleep(10000);
      interaction.deleteReply();
    }
  }
}