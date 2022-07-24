const { EmbedBuilder, Colors, InteractionType, PermissionFlagsBits } = require('discord.js');

module.exports = async (client, interaction) => {
  if (!interaction.isRepliable() || interaction.type != InteractionType.ApplicationCommand) return;

  const command = client.commands.get(interaction.commandName);
  await interaction.deferReply({ ephemeral: command.ephemeralDefer });

  const cooldown = await require('../Functions/private/cooldowns.js')(client, interaction, command);
  if (cooldown) return interaction.editReply(`This command is on cooldown! Try again in \`${cooldown}\`s.`);

  if (command.category.toLowerCase() == 'owner-only' && interaction.user.id != client.application.owner.id) return;
  //DO NOT REMOVE THIS LINE!

  let player = client.musicPlayer?.interaction?.get(interaction.guild.id);
  if (!player || player.channel.id != interaction.channel.id) player = interaction;

  player.queue = client.musicPlayer.getQueue(player.guild.id);

  if (command.needsVC && !interaction.member.voice.channel) return interaction.editReply('You need to join a voice channel first!');
  if (command.needsQueue && !player.queue) return interaction.editReply('You need to play music first!');

  const userPerms = interaction.member.permissionsIn(interaction.channel).missing([...command.permissions.user, PermissionFlagsBits.SendMessages]);
  const botPerms = interaction.guild.members.me.permissionsIn(interaction.channel).missing([...command.permissions.client, PermissionFlagsBits.SendMessages]);

  if (botPerms.length || userPerms.length) {
    const embed = new EmbedBuilder({
      title: 'Insufficient Permissions',
      color: Colors.Red,
      description:
        `${userPerms.length ? 'You' : 'I'} need the following permissions in this channel to run this command:\n\`` +
        (botPerms.length ? botPerms : userPerms).join('`, `') + '`'
    });

    return interaction.editReply({ embeds: [embed] });
  }

  try { await command.run(player, interaction, client) }
  catch (err) {
    await require('../Functions/private/error_handler.js')(interaction, err);
  }

  if (command.category.toLowerCase() == 'music' && player.id != interaction.id) {
    await client.functions.sleep(10000);
    interaction.deleteReply();
  }
}