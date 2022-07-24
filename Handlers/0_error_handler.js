const { red } = require('chalk').bold;

function sendErrorMsg(errorName, client, msg) {
  if (!msg) msg =
    'A unexpected error occurred, please message the dev.\n' +
    `Error Type: \`${errorName || 'unknown'}\``;
/*
  if (!player) return client.interaction?.editReply(data);

  if (player.replied) return client.functions.editPlayer(player, data);
  else return player.reply(data);
  */
  client.interaction?.editReply(data);
}

module.exports = client => {

  process
    .on('unhandledRejection', (err, origin) => {
      console.error(red(' [Error Handling] :: Unhandled Rejection/Catch'));
      console.error(err, origin + '\n');

      if (err.name === 'DiscordAPIError')
        sendErrorMsg(null, client, 'An Discord API Error occurred, please try again and message the dev if this keeps happening.');
      else sendErrorMsg(err.name, client)
    })

    .on('uncaughtException', (err, origin) => {
      client.log(red(' [Error Handling] :: Uncaught Exception/Catch'));
      console.error(err, origin + '\n');

      sendErrorMsg(err.name, client);
    })

    .on('uncaughtExceptionMonitor', (err, origin) => {
      console.error(red(' [Error Handling] :: Uncaught Exception/Catch (MONITOR)'))
      console.error(err, origin + '\n');

      sendErrorMsg(err.name, client);
    });

  client.rest.on('rateLimited', info => client.log(`Waiting for ${info.global ? 'global ratelimit' : `ratelimit on ${info.route}`} to subside (${info.timeToReset}ms)`));
}