const { ActivityType } = require('discord.js');

module.exports = function ready() { this.user.setActivity({ name: '/help', type: ActivityType.Playing }) };