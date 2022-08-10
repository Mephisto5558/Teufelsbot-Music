const { ActivityType } = require('discord.js');

module.exports = ({ user }) => user.setActivity({ name: '/help', type: ActivityType.Playing });