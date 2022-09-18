module.exports = {
  name: 'setup',
  aliases: [],
  description: 'Sets the commands up.',
  usage: '',
  permissions: { client: [], user: ['ManageGuild'] },
  cooldowns: { guild: 0, user: 10000 },
  category: 'Useful',
  beta: true,
  options: [{
    name: 'sync',
    description: 'force syncs my slash commands with your guild',
    type: 'Subcommand'
  }],

  run: async function (_, client) {
    const cmd = this.options.getSubcommand();

    if (cmd == 'sync') {
      await require('../../Handlers/slash_command_handler.js').call(client, this.guild.id);

      this.editReply('Finished syncing.');
    }
  }
}