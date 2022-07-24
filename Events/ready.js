const { ActivityType } = require('discord.js');

module.exports = async ({ user }) => user.setActivity({ name: '/help', type: ActivityType.Playing })