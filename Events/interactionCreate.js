const { EmbedBuilder, Colors, InteractionType, PermissionFlagsBits } = require('discord.js');

module.exports = async (client, interaction) => {
  const command = client.commands.get(interaction.commandName);
  if (!command || !interaction.isRepliable()) return;

  const cooldown = await require('../Functions/private/cooldowns.js')(client, interaction.user, command);
  if (cooldown) return interaction.reply(`This command is on cooldown! Try again in \`${cooldown}\`s.`);

  if (command.category.toLowerCase() == 'owner-only' && interaction.user.id != client.application.owner.id) return;
  //DO NOT REMOVE THIS LINE!

  let errorMsg;

  const player = client.musicPlayer?.interaction?.get(interaction.guild.id);
  if (!player || player.channel.id != interaction.channel.id) player = interaction;
  else player.queue = client.musicPlayer.getQueue(interaction.guild.id);

  if (!interaction.member.voice.channel && !['information', 'useful'].includes(command.category.toLowerCase()) && interaction.commandName != 'leave')
    errorMsg = `You need to join a voice channel first!`;
  else if (command.needsQueue && !player.queue) errorMsg = `You need to play music first!`;

  if (errorMsg) return interaction.reply({ content: errorMsg, ephemeral: true });

  if (interaction.type === InteractionType.ApplicationCommand) {
    const userPerms = interaction.member.permissionsIn(interaction.channel).missing([...command.permissions.user, PermissionFlagsBits.SendMessages]);
    const botPerms = interaction.guild.members.me.permissionsIn(interaction.channel).missing([...command.permissions.client, PermissionFlagsBits.SendMessages]);

    const embed = new EmbedBuilder({
      title: 'Insufficient Permissions',
      color: Colors.Red,
      description:
        `${userPerms.length ? 'You' : 'I'} need the following permissions in this channel to run this command:\n\`` +
        (botPerms.length ? botPerms : userPerms).join('`, `') + '`'
    });

    if (botPerms.length || userPerms.length) return interaction.reply({ embeds: [embed], ephemeral: true });
    if (!command.noDefer) await interaction.deferReply({ ephemeral: command.ephemeralDefer || false });

    for (const entry of interaction.options._hoistedOptions)
      if (entry.type == 'STRING') entry.value = entry.value.replace(/<@!/g, '<@');

    player.queue = client.musicPlayer.getQueue(player.guild.id);

    client.interaction = interaction;
    await command.run(player, interaction, client);
    client.interaction = null;

    if (command.category.toLowerCase() == 'music' && player.id && player.id != interaction.id) interaction.deleteReply();
  }
}