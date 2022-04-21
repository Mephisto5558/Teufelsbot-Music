module.exports = (client) => {
  const fs = require('fs');
  let commandCount = 0;
  
  fs.readdirSync("./Commands").forEach(cmd => {
    fs.readdirSync(`./Commands/${cmd}/`).filter((file) => file.endsWith(".js")).forEach((command) => {
      let pull = require(`../Commands/${cmd}/${command}`);
      if (pull.name) {
        if(pull.disabled) return;
        client.commands.set(pull.name, pull);
        client.slashCommandList.push(pull)
        console.log(`Loaded Slash Command ${pull.name}`)
        commandCount++
      }
      if (pull.aliases && Array.isArray(pull.aliases)) pull.aliases.forEach(alias => client.aliases.set(alias, pull.name));
    });
  });
  
  console.log(`${commandCount} Slash Commands loaded\n`);
}