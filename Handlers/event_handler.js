module.exports = (client) => {
  const fs = require('fs');
  var eventCount = 0;

  fs.readdirSync("./Events")
    .filter(file => file.endsWith(".js") && file != 'interactionCreate.js')
    .forEach(file => {
      const eventName = file.split(".")[0];
      const event = require(`../Events/${file}`);
      client.events.set(eventName, event);
      client.log(`Loaded Event ${eventName}`);
      eventCount++
    });
    client.log(`Loaded ${eventCount} events\n`)
}
