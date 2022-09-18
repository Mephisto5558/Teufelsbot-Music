const { Collection } = require('discord.js');

module.exports = function cooldown({ guild, member }, { name, cooldowns }) {
  if (!this.cooldowns.has(name)) this.cooldowns.set(name, new Collection());

  const
    now = Date.now(),
    timestamps = this.cooldowns.get(name),
    expirationTimeGuild = (timestamps.get(`g:${guild.id}`) ?? now),
    expirationTimeUser = (timestamps.get(`u:${member.id}`) ?? now);

  if (expirationTimeGuild > now && expirationTimeGuild > expirationTimeUser) return Math.round((expirationTimeGuild - now) / 1000);
  else if (expirationTimeUser > now && expirationTimeUser > expirationTimeGuild) return Math.round((expirationTimeUser - now) / 1000);
  else {
    timestamps.set(`g:${guild.id}`, now + cooldowns.guild);
    timestamps.set(`u:${member.id}`, now + cooldowns.user);
    return 0;
  }
}