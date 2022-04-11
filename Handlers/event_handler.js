module.exports = (client) => {
  const fs = require('fs');
  var eventCount = 0;

  fs.readdirSync("./Events").filter(file => file.endsWith(".js")).forEach(file => {
    const eventName = file.split(".")[0];
    const event = require(`../Events/${file}`);
    client.events.set(eventName, event);
    console.log(`Loaded Event ${eventName}`);
  eventCount++
  });
  console.log(`Loaded ${eventCount} events\n`)
}
