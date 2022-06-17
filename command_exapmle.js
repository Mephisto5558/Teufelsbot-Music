const { Command } = require('reconlx');

module.exports = new Command({
    name: '',
    description: '',
    permissions: { client: [], user: [] },
    cooldown: { client: 0, user: 0 },
    category : '',
    needsQueue: false,

    run: async ({ client, interaction, args }) => {

    }
})