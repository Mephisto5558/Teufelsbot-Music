const { MessageEmbed } = require('discord.js');
const { colors } = require('../Settings/embed.json');

module.exports = async (client, interaction) => {
  const command = client.slashCommands.get(interaction.commandName);
  if (!command) return;

  let errorMsg;

  let player = client.musicPlayer?.interaction?.get(interaction.guild.id);
  if(!player || player.channel.id != interaction.channel.id) player = interaction; //add check if interaction has been deleted
  else player.queue = client.musicPlayer.getQueue(interaction.guild.id);

  if(!interaction.member.voice.channel && !['information', 'useful'].includes(command.category.toLowerCase()) && interaction.commandName != 'leave')
    errorMsg = `You need to join a voice channel first!`;
  else if(command.needsQueue && !player.queue) errorMsg = `You need to play music first!`;

  if (errorMsg) return interaction.reply({ content: errorMsg, ephemeral: true });

  if (interaction.isCommand()) {
    command.permissions.user.push('SEND_MESSAGES');
    command.permissions.client.push('SEND_MESSAGES');

    let embed = new MessageEmbed()
      .setTitle('Insufficient Permissions')
      .setColor(colors.discord.RED);

    if (!interaction.member.permissions.has(command.permissions.user)) {
      embed.setDescription(
        `Your are missing the following permissions to run this command:\n\`` +
        interaction.member.permissions.missing(command.permissions.user).join('`, `') + '`'
      )
    }

    if (!interaction.guild.me.permissions.has(command.permissions.client)) {
      embed.setDescription(
        `I am missing the following permissions to run this command:\n\`` +
        interaction.guild.me.permissions.missing(command.permissions.client).join('`, `') + '`'
      )
    }

    if (embed.description) return interaction.reply({ embeds: [embed], ephemeral: true });
    if (!command.noDefer) await interaction.deferReply({ ephemeral: command.ephemeralDefer || false });

    interaction.options._hoistedOptions.forEach(entry => { if(entry.type == 'STRING') entry.value = entry.value?.replace(/<@!/g, '<@') });

    player.queue = client.musicPlayer.getQueue(player.guild.id);

    client.interaction = interaction;
    await command.run(player, interaction, client);
    if(command.category.toLowerCase() == 'music' && player.id && player.id != interaction.id) interaction.deleteReply();

    client.interaction = null;
  }
}