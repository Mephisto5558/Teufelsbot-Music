const { readdirSync } = require('fs');

module.exports = function eventHandler() {
  let eventCount = 0;
  //InteractionCreate gets loaded when all slash commands are registred
  for (const file of readdirSync('./Events').filter(e => e.endsWith('.js') && e != 'interactionCreate.js')) {
    const eventName = file.split('.')[0];
    const event = require(`../Events/${file}`);

    this.on(eventName, args => event.call(...[].concat(args ?? this)));
    this.log(`Loaded Event ${eventName}`);
    eventCount++;
  }

  this.log(`Loaded ${eventCount} Events\n`);
};