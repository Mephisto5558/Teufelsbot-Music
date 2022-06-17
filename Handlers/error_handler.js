const errorColor = require('chalk').bold.red;

function reply(client, data, channel, errorType) {
  const player = client.musicPlayer.interaction?.get(channel?.guild.id) || client.musicPlayer.interaction?.get(client.interaction?.guild.id);

  if (!data) data =
    'A unexpected error occurred, please message the dev.\n' +
    `Error Type: \`${errorType || 'unknown'}\``;
  //else if(data.embeds && !data.embeds[0]) data.embeds = Array(data.embeds); //not needed yet

  if (!player) return client.interaction?.followUp(data);

  if (player.replied) return editReply(player, data);
  else return player.reply(data);
}

module.exports = client => {

  process
    .on('unhandledRejection', (err, origin) => {
      console.error(errorColor(' [Error Handling] :: Unhandled Rejection/Catch'));
      console.error(err, origin + '\n');

      if (err.name === 'DiscordAPIError')
        reply(client, 'An Discord API Error occurred, please try again and message the dev if this keeps happening.');
      else reply(client, null, null, err.type);
    })

    .on('uncaughtException', (err, origin) => {
      client.log(errorColor(' [Error Handling] :: Uncaught Exception/Catch'));
      console.error(err, origin + '\n');

      reply(client, null, null, err.type);
    })

    .on('uncaughtExceptionMonitor', (err, origin) => {
      console.error(errorColor(' [Error Handling] :: Uncaught Exception/Catch (MONITOR)'))
      console.error(err, origin + '\n');

      reply(client, null, null, err.type);
    });

  client
    .on('rateLimit', info => {
      const msg = `Rate limit hit, please wait ${Math.floor(info.timeout / 1000)}s before retrying.`
      console.error(errorColor(msg));
      console.error(info);
      console.error('\n');

      reply(client, msg);
    });

}