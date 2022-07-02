const { MessageEmbed } = require('discord.js');
const { colors } = require('../Settings/embed.json');

module.exports = async (client, interaction) => {
  const command = client.slashCommands.get(interaction.commandName);
  if (!command) return;

  let errorMsg;

  let player = client.musicPlayer?.interaction?.get(interaction.guild.id);
  if (!player || player.channel.id != interaction.channel.id) player = interaction; //add check if interaction has been deleted
  else player.queue = client.musicPlayer.getQueue(interaction.guild.id);

  if (!interaction.member.voice.channel && !['information', 'useful'].includes(command.category.toLowerCase()) && interaction.commandName != 'leave')
    errorMsg = `You need to join a voice channel first!`;
  else if (command.needsQueue && !player.queue) errorMsg = `You need to play music first!`;

  if (errorMsg) return interaction.reply({ content: errorMsg, ephemeral: true });

  if (interaction.isCommand()) {
    command.permissions.user.push('SEND_MESSAGES');
    command.permissions.client.push('SEND_MESSAGES');

    let embed = new MessageEmbed({
      title: 'Insufficient Permissions',
      color: colors.discord.RED
    });

    if (interaction.isCommand()) {
      const userPerms = interaction.member.permissionsIn(interaction.channel).missing([...command.permissions.user, 'SEND_MESSAGES']);
      const botPerms = interaction.guild.me.permissionsIn(interaction.channel).missing([...command.permissions.client, 'SEND_MESSAGES']);

      const embed = new MessageEmbed({
        title: 'Insufficient Permissions',
        color: colors.discord.RED,
        description:
          `${userPerms.length ? 'You' : 'I'} need the following permissions in this channel to run this command:\n\`` +
          (botPerms.length ? botPerms : userPerms).join('`, `') + '`'
      });

      if (botPerms.length || userPerms.length) return interaction.reply({ embeds: [embed], ephemeral: true });
      if (!command.noDefer) await interaction.deferReply({ ephemeral: command.ephemeralDefer || false });

      interaction.options._hoistedOptions.forEach(entry => { if (entry.type == 'STRING') entry.value = entry.value?.replace(/<@!/g, '<@') });

      player.queue = client.musicPlayer.getQueue(player.guild.id);

      client.interaction = interaction;
      await command.run(player, interaction, client);
      if (command.category.toLowerCase() == 'music' && player.id && player.id != interaction.id) interaction.deleteReply();

      client.interaction = null;
    }
  }
}