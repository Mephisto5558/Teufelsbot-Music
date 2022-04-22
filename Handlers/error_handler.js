module.exports = (client) => {
  
  process
    .on('unhandledRejection', (err, origin) => {
      if(err.response?.status === 429) {
        console.error(`[Error Handling] :: Hit a Rate Limit`);
        console.error(origin);
        return console.error(`\n`);
      };
      console.error(' [Error Handling] :: Unhandled Rejection/Catch')
      console.error(err, origin);
      console.error(`\n`)
      
      if(!err.errorCode) err.errorCode = 'unknown'
      if(err.name == 'DiscordAPIError') client.interaction?.channel.send("A Discord API Error occured, please try again and ping the dev if this keeps happening.");
      else client.interaction?.channel.send(`A unknown error occurred, please ping the dev.\nError Code: \`${err.errorCode}\``);
    })
  
    .on('uncaughtException', (err, origin) => {
      console.error(' [Error Handling] :: Uncaught Exception/Catch');
      console.error(err, origin);
      console.error(`\n`);
      
      if(!err.errorCode) err.errorCode = 'unknown'
      client.interaction?.channel.send(`A unknown error occurred, please ping the dev.\nError Code: \`${err.errorCode}\``);
    })
  
    .on('uncaughtExceptionMonitor', (err, origin) => {
      console.error(' [Error Handling] :: Uncaught Exception/Catch (MONITOR)');
      console.error(err, origin);
      console.error(`\n`);
      
      if(!err.errorCode) err.errorCode = 'unknown'
      client.interaction?.channel.send(`A unknown error occurred, please ping the dev.\nError Code: \`${err.errorCode}\``);
    });
  
  client
    .on('rateLimit', (info) => {
      console.error(`Rate limit hit ${info.timeDifference ? info.timeDifference : info.timeout ? info.timeout: 'Unknown timeout '}`)
      client.interaction?.followUp(`Rate limit hit ${info.timeDifference ? info.timeDifference : info.timeout ? info.timeout: 'Unknown timeout '}`)
    });

}