const { Command } = require('reconlx');

module.exports = new Command({
    name: '',
    aliases: [],
    description: '',
    permissions: { client: [], user: [] },
    cooldowns: { client: 0, user: 0 },
    category : '',
    ephemeralDefer: false,
    needsQueue: false,

    run: async (player, interaction, client) => {

    }
})