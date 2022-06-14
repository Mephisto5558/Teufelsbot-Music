const { MessageEmbed } = require('discord.js');
const { colors } = require('../Settings/embed.json');

module.exports = async (client, interaction) => {

  let command = client.slashCommands.get(interaction.commandName);
  if (!command) return;

  const filter = !interaction.member.voice.channel && !['information', 'useful'].includes(command.category.toLowerCase()) && interaction.commandName != 'leave';
  if (filter) return interaction.reply({ content: `You need to join a voice channel first!`, ephemeral: true });

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

    client.interaction = interaction;
    await command.run(client, interaction);
    return client.interaction = null;
  }
}