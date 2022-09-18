const
  { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, Colors } = require('discord.js'),
  { DisTubeError } = require('distube'),
  { Octokit } = require('@octokit/core'),
  { Github } = require('../../config.json');

module.exports = async function errorHandler(err, interaction) {
  if (!this.error) this.error = console.error;
  if (!interaction) {
    this.error(errorColor, ' [Error Handling] :: Uncaught Error');
    return this.error(err);
  }

  const
    octokit = new Octokit({ auth: process.env.githubKey }),
    embed = new EmbedBuilder({
      title: 'Whoooops',
      description:
        'A unexpected error occurred!\n\n' +
        `Error Type: \`${err.name}\`\n` +
        `Command: \`${interaction.commandName}\``,
      color: Colors.DarkRed
    }),
    comp = new ActionRowBuilder({
      components: [
        new ButtonBuilder({
          customId: 'reportError',
          label: 'Report this Error',
          style: ButtonStyle.Danger
        })
      ]
    });

  if (err instanceof DisTubeError) {
    switch (err.code) {
      case 'VOICE_FULL': return interaction.followUp('Your voice channel is full!');
      case 'VOICE_CONNECT_FAILED': return interaction.followUp("I couldn't connect to your voice channel. Please try again!");
      case 'VOICE_MISSING_PERMS': return interaction.followUp("I don't have permission to join your voice channel!");

      case 'NO_UP_NEXT': return;
    }
  }

  this.error(errorColor, ' [Error Handling] :: Uncaught Error');
  this.error(err);

  const msg = await interaction.followUp({ embeds: [embed], components: [comp] });

  const collector = interaction.channel.createMessageComponentCollector({ filter: i => i.member.id == interaction.member.id && i.customId == 'reportError', max: 1, componentType: ComponentType.Button, time: 60000 });
  collector.on('collect', async button => {
    await button.deferUpdate();
    collector.stop();

    try {
      const issues = await octokit.request(`GET /repos/${Github.UserName}/${Github.RepoName}/issues`, {});
      const title = `${err.name}: "${err.message}" in command "${interaction.commandName}"`;

      if (issues.data.filter(e => e.title == title && e.state == 'open').length) {
        embed.data.description = `This issue has already been reported. [Link](${issues.data[0].html_url})\nIt will be fixed soon.`;
        return msg.edit({ embeds: [embed], components: [comp] });
      }

      await octokit.request(`POST /repos/${Github.UserName}/${Github.RepoName}/issues`, {
        title: title,
        body:
          `<h3>Reported by ${interaction.user.tag} (${interaction.user.id}) with bot ${interaction.guild.members.me.id}</h3>\n\n` +
          err.stack,
        assignees: [Github.UserName],
        labels: ['bug']
      });

      embed.data.description = `Your issue has been reported. [Link](${Github.Repo}/issues?q=is%3Aopen+is%3Aissue+${title} in:title)`;
      msg.edit({ embeds: [embed], components: [comp] });
    }
    catch (err) {
      interaction.followUp(`An error occurred while trying to send your error report.\n${err?.response.statusText || ''}\nPlease message the dev directly.`);
      this.error(err);
    }
  });

  collector.on('end', _ => {
    comp.components[0].setDisabled(true);
    msg.edit({ embeds: [embed], components: [comp] });
  });
}